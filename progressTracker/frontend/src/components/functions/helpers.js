export const getStudents = () => {
  if (localStorage.getItem('isStudent') == 'false') {
    return (fetch(localStorage.getItem('courseUrl') + 'students', {
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        if (response.status > 400) {
          throw new Error("Something went wrong!");
        }
        return response.json();
      })
      .then(data => {
        data = data.students;
        return (data);
      }))
  } else {
    throw new Error("Only teacher can see this view!");
  }
}

export const checkUser = (returnPage) =>{
  if (localStorage.getItem('token')) {
    return (fetch('/api/auth/user', {
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (res.status > 400) {
          console.log(res);
        }
        return res.json()
      })
      .then(resp => {
        if (resp.user.is_student != false) {
          alert("Only teacher can see this view");
          window.location.href = returnPage;
        }else{
          return (resp);
        }
      })
      .catch(err => console.log(err)));

  } else {
    alert('Log into to see the view');
    window.location.href = "/";
    return new Promise(null);
  }
}

export const getElement = (url) => {
  return (fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  })
    .then(response => {
      if (response.status > 400) {
        throw new Error("Something went wrong!");
      }
      return response.json();
    })
    .then(data => {
      return (data);
    }))
  }

export const extractID = (url) => {
  let idString = "";
  let slashes = 0;
  for (let i = 0; i < url.length; i++) {
    if (url[i] === '/')
      slashes++;
    if (slashes === 5 && url[i] !== '/')
      idString += url[i];
  }
  return parseInt(idString);
}

export const getArgs = (rule, x, selectedX, y) => {
  let argsNumber = 0;

  if (rule === 'MAX' || rule === 'THRESH') {
    argsNumber = 1;
  }

  let args = "";
  if (argsNumber === 1) {
    if (rule === 'THRESH') {
      args = x
    } else {
      args = selectedX.value;
    }
  } else if (argsNumber === 2) {
    args = `${x} ${y}`
  }
  return args;
}

export const getFullRule = (kind, rawArgs, tasks) => {
  const rule = convertAchievementRule(kind);

  const args = rawArgs.split(' ');

  if (kind === 'MAX') {
    for (let i=0; i<tasks.length; i++) {
      if (extractID(tasks[i].url) === parseInt(args[0])) {
        args[0] = `"${tasks[i].name}"`;
        break;
      }
    }
  }
  let currArg = 0;

  if (args.length === 0) {
    return rule;
  }

  const variables = "XY";

  let fullRule = "";

  for (let i=0; i<rule.length; i++) {
    if (rule[i] === variables[currArg]) {
      fullRule += args[currArg++];
    } else {
      fullRule += rule[i];
    }
  }

  return fullRule;
}

export const rules = [
  'pass all tasks',
  'get 100% from task X',
  'get X% from course',
  'complete bonus task',
  '100% from 3 tasks within a month'
]

export const convertAchievementRule = (rule) => {
  switch (rule) {
    case 'ALL':
      return 'pass all tasks';
    case 'pass all tasks':
      return 'ALL';
    case 'MAX':
      return 'get 100% from task X';
    case 'get 100% from task X':
      return 'MAX';
    case 'THRESH':
      return 'get X% from course';
    case 'get X% from course':
      return 'THRESH';
    case 'BONUS':
      return 'complete bonus task';
    case 'complete bonus task':
      return 'BONUS';
    case 'STREAK':
      return '100% from 3 tasks within a month';
    case '100% from 3 tasks within a month':
      return 'STREAK';
    default:
      console.log(rule)
      throw new Error(`Invalid achievement rule: ${rule}`);
  }
}