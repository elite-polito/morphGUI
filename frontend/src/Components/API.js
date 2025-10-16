const logIn = async (credentials) => {
  const response = await fetch('http://localhost:3001' + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();

    throw errDetails;
  }
};
const log = async(message, type, user)=>{
  const response = await fetch(`http://localhost:3001/api/log?userId=${user.user_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({message:message, type: type}),
  });
  if(response.ok) {
    console.log("Log To Server")
  }
  else {
    console.log("Failed Log To Server")

  }
}
const logger  =  {
  start: (user, message, ) => log(message, 0, user),
  generate: (user, message, ) => log(message, 1, user),
  endgenerate: (user, message, ) => log(message, 2, user),
  resetUI: (user, message, ) => log(message, 3, user),
  prevUI: (user, message, ) => log(message,4, user),
  info: (user,message) => log(message, 5, user),
  warn: (user,message) => log(message, 6, user),
  error: (user,message) => log(message, 7, user),
  end: (user, message) => log(message, 8, user),

}
export {logIn, logger}
