
//& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
const { faker } = require('@faker-js/faker');
const mysql= require('mysql2');
const express=require("express");
const app = express();
const path=require("path");
const methodOverride= require("method-override");


app.use(methodOverride("_method"));

app.use(express.urlencoded({extended: true}));




const port =8080;
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

let getRandomUser= () =>{
  return [
     faker.string.uuid(),
     faker.internet.username(), 
     faker.internet.email(),
     faker.internet.password(),
  ];
};


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password:'Gupta@12414528'
});


// let data= [];
// for(let i=1;i<=100;i++){
//   data.push(getRandomUser());
// }

// let q="INSERT INTO user (id,username,email,password) VALUES ?";


// try{  
// connection.query(q,[data],(err,result)=>{
//   if(err) throw err;
//   console.log(result);
// });
// }
// catch(err){
//   console.log(err);
// }

// connection.end();

app.get("/",(req,res)=>{
  let q="select count(*) from user";
  try{  
connection.query(q,(err,result)=>{
  if(err) throw err;
  console.log(result[0]["count(*)"]);
  let count= result[0]["count(*)"];
  res.render("home.ejs",{count});
});
}
catch(err){
  res.send("Some Error Occured");
}
});

app.get("/users",(req,res)=>{
  let q="select id,username,email from user";
  try{  
connection.query(q,(err,user)=>{
  if(err) throw err;
  // console.log(result);
  // let count= result[0]["count(*)"];
  res.render("users.ejs",{user});
  // res.send(result)
});
}
catch(err){
  res.send("Some Error Occured");
}

});

// edit rout

app.get("/users/:id/edit",(req,res)=>{
  let {id}= req.params;
  let q= `select * from user where id='${id}'`;
   try{  
connection.query(q,(err,result)=>{
  if(err) throw err;
  let user= result[0];
  // let count= result[0]["count(*)"];
  res.render("edit.ejs",{user});
  // res.send(user);
});
}
catch(err){
  console.log(err);
  res.send("Some Error Occured");
}
  
});


// update route
app.patch("/user/:id",(req,res) =>{
  // res.send("Updated");
  let {id}= req.params;
  let q= `select * from user  where id='${id}'`;
  let {password: formPass,username: newUsername}=req.body;
   try{  
connection.query(q,(err,result)=>{
  if(err) throw err;
  let user= result[0];
  // let count= result[0]["count(*)"];
  // res.render("edit.ejs",{user});
  if(formPass!=user.password){
    res.send("WRONG PASSWORD")
  }
  else{
    let q2=`update user set username='${newUsername}' where id='${id}'`;
    connection.query(q2,(err,result)=>{
      if(err) throw err;
      res.redirect("/users");
    });
  }
  // res.send(user);
});
}
catch(err){
  console.log(err);
  res.send("Some Error Occured");
}

});

app.listen(port,() =>{
  console.log(`Server Listening to port ${port}.`)
})
