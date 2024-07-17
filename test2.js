let password = ['password1', 'password2'];
(async()=>{
    let hashedPasswordArray = await Promise.all(password.map(async (text) => text + 2));
    console.log(hashedPasswordArray);
    
})()
