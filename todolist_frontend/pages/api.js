/**
 *
 * @returns

 *
 */

let url = 'http://172.20.10.5:3000/';


let getTodos = 'getTodosList'; 
let addTodos = 'addTodosItem'; 
let deleteTodos = 'deleteTodosItem'; 


function getTodosList(urlsuffix) {
  let suffix = '';
  if (urlsuffix != 'all') {
    suffix = urlsuffix;
  }

  return (
    fetch(url + getTodos + `?cate=${suffix}`)
      .then(response => response.json())
      .then(responseJson => {
        return responseJson.data;
      })
      
      .catch(error => {
        console.error(error);
      })
  );
}


function addTodosList(item) {
  return fetch(url + addTodos, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
}


function deleteTodosItem(item) {
  return fetch(url + deleteTodos, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
}

module.exports = {getTodosList, addTodosList, deleteTodosItem};
