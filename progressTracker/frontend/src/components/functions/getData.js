export const getStudents = () => {
    if(sessionStorage.getItem('isStudent')=='false'){
      return(fetch(localStorage.getItem('courseUrl')+'students', {
            method : 'GET',
            headers : {
                Authorization : `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (response.status > 400) {
                throw new Error("Something went wrong!");
               }
            return response.json();
        })
        .then(data => {
            console.log("students "+data)
            console.log("students "+data.students)
            return (data.student);
        }))
    }
    else{
        throw new Error("Only teacher can rate students!");
    }
}


export const getTask = () => {
    if(sessionStorage.getItem('isStudent')=='false'){
        return(fetch(localStorage.getItem('taskUrl'), {
            method : 'GET',
            headers : {
                Authorization : `Token ${localStorage.getItem('token')}`
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
    else{
        throw new Error("Only teacher can rate students!");
    }
}