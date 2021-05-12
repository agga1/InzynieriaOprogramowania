export const getStudents = () => {
  if (sessionStorage.getItem('isStudent') == 'false') {
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


export const getTask = () => {
  // if(sessionStorage.getItem('isStudent')=='false'){
  return (fetch(localStorage.getItem('taskUrl'), {
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
  // }
  // else{
  //     throw new Error("Only teacher can rate students!");
  // }
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

export const getArgs = (rule, x, y) => {
  let argsNumber = 0;

  if (rule === 'MAX' || rule === 'THRESH') {
    argsNumber = 1;
  }

  let args = "";
  if (argsNumber === 1) {
    args = x;
  } else if (argsNumber === 2) {
    args = `${x} ${y}`
  }

  return args;
}

export const getFullRule = (kind, rawArgs) => {
    const rule = convertAchievementRule(kind);

    const args = rawArgs.split(' ');
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

export const options = [
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