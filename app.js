var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    flash                 = require("connect-flash"),
    methodOverride        = require("method-override"),
    expressValidator      = require("express-validator"),
    User                  = require("./models/user"),
    Develop               = require("./models/develop"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")

mongoose.connect(process.env.MONGODB_URI);
var app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
var port = process.env.PORT || 3000;

//USE PACKAGES
app.use(require("express-session")({
  secret:"Secret!!! Yarkittayum Solla Koodathuu",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//USE FLASH

app.use(flash());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('error');
    next();
});


//DASHBOARD SCHEMA DECLARATION

var appSchema = new mongoose.Schema({
    id           : String,
    projectname  : String,
    status       : String,
    assignedto   : String,
    date         : String,
    duedate      : String,
    description  : String,
    totalpayment : String,
    advance      : String,
    balance      : String,
    report       : String,
    customername : String,
    contactnumber: String,
    address      : String,
    sellingprice : String,
    advancee      : String,
    balancee      : String
});

var App = mongoose.model("App",appSchema);  

var searchSchema = new mongoose.Schema({
   info   : String
});

var Search = mongoose.model("Search",searchSchema);


//ROUTES

app.get("/",function(req,res){
    res.render("index");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/login",function(req,res){
    res.render('login', {error:'Please check your user credentials'});
});

app.get("/register2",function(req,res){
    res.render("register2");
});

app.get("/login2",function(req,res){
    res.render('login2',{error:'Please check your user credentials'});
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/login");
});

app.get("/logout2",function(req,res){
    req.logout();
    res.redirect("/login2")
});

app.get("/add",function(req,res){
    res.render("addproject");
});

app.get("/addcustomer",function(req,res){
    res.render("addcustomer");
});

app.get("/adminreport",function(req,res){ 
    res.render("adminreport");
});

app.get("/payments",function(req,res){
     App.find({},function(err,any){
        if(err){
            console.log(err);
        } else {
            res.render("payments",{any:any});
        }
     }); 
});

app.get("/customer",function(req,res){
      App.find({},function(err,all){
        if(err){
            console.log(err);
            
        }else {
           
                res.render("customer",{all:all});
            }
        });
}); 

app.get("/addcustomer",function(req,res){
    
    res.render("addcustomer");
});

app.get("/customer/:id",function(req,res){
     
    App.findById(req.params.id,function(err,click){
        if(err){
            console.log(err);
        } else {
    res.render("addcustomer",{passing:click});        
        }
   });
});

app.put("/a/:id",function(req,res){
    App.findByIdAndUpdate(req.params.id,req.body.custo,function(err,updated){
        if(err){
            res.redirect("/customer");
        }  else {
            res.redirect("/customer");    
        }
    });
    
});

app.get("/edit/:id",function(req,res){
     
    App.findById(req.params.id,function(err,click){
        if(err){
            console.log(err);
        } else {
    res.render("editcustomer",{passing:click});        
        }
   });
});

app.put("/b/:id",function(req,res){
    App.findByIdAndUpdate(req.params.id,req.body.edit,function(err,updated){
        if(err){
            res.redirect("/customer");
        }  else {
            res.redirect("/customer");    
        }
    });
    
});
//======================


//AUTHENTICATION

//FOR ADMIN
app.post("/register",function(req,res){
    var name = req.body.name;
    var email = req.body.email;
    var phonenumber = req.body.phonenumber;
    var username = req.body.username;
    var password = req.body.password;

    
        User.register(new User({
            name: name,
            email: email,
            phonenumber: phonenumber,
            username: username}),req.body.password,function(err,user){
            passport.authenticate("local")(req,res,function(){
                console.log(user);
                res.redirect("/dashboard"); 
            });
        });
});


app.post("/login",passport.authenticate("local",{
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true
}),function(req,res){
    res.render('/');
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
       return next();
       }else {
           res.redirect("/login");
       }
}


//FOR DEVELOPER
app.post("/register2",function(req,res){
    var name = req.body.name;
    var email = req.body.email;
    var phonenumber = req.body.phonenumber;
    var username = req.body.username;
    var password = req.body.password;
    
        Develop.register(new Develop({
            name: name,
            email: email,
            phonenumber: phonenumber,
            username: username}),req.body.password,function(err,develop){
            passport.authenticate("local")(req,res,function(){
                console.log(develop)
                res.redirect("/dashboard2"); 
            });
        });
});


app.post("/login",passport.authenticate("local",{
    successRedirect: "/dashboard2",
    failureRedirect: "/login",
    failureFlash: true
}),function(req,res){
    res.render('/');
});


function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
       return next();
       }else {
           res.redirect("/login2");
       }
}

//===================================


//ADD PROJECTS

app.get("/dashboard",isLoggedIn,function(req,res){
    App.find({},function(err,all){
        if(err){
            console.log(err);  
        }else {
            res.render("home",{all:all});
        }
    });
});
    
app.post("/form",function(req,res){
    
var id           =   req.body.id,
    projectname  =   req.body.projectname,
    status       =   req.body.status,
    assignedto   =   req.body.assignedto,
    date         =   req.body.date,
    duedate      =   req.body.duedate,
    description  =   req.body.description,
    totalpayment =   req.body.totalpayment,
    advance      =   req.body.advance,
    balance      =   req.body.balance,
    customername =   req.body.customername,
    contactnumber=   req.body.contactnumber,
    address      =   req.body.address,
    sellingprice =   req.body.sellingprice,
    advancee     =   req.body.advancee,
    balancee     =   req.body.balancee; 
    
var form =   { id:id, 
              projectname:projectname,
              status:status,
              assignedto:assignedto,
              date:date,
              duedate:duedate,
              description:description,
              totalpayment:totalpayment,
              advance:advance,
              balance:balance,
              customername:customername,
              contactnumber:contactnumber,
              address:address,
              sellingprice:sellingprice,
              advacee:advancee,
              balancee:balancee };
    
    App.create(form,function(err,form){
        if(err){
            console.log(err);
        } else{
            console.log(form)
        }
    }); 
    res.redirect("/dashboard");
});

//============================


//SEARCHING PROJECTS

app.post("/getting",function(req,res){
    if(req.body.info){
        var day = req.body.info;
        App.find({id:day},function(err,all){
            if(err){
                console.log(err);
            } else {
                res.render("home",{all:all});
            }
        }  );

    }
   
} );

//===================


//EDIT PROJECTS

app.get("/dashboard/:id",function(req,res){
     
    App.findById(req.params.id,function(err,click){
        if(err){
            console.log(err);
        } else {
            res.render("edit",{passing:click});
        }
   });
});

app.put("/:id",function(req,res){
    App.findByIdAndUpdate(req.params.id,req.body.edit,function(err,updated){
        if(err){
            res.redirect("/dashboard");
        }  else {
            res.redirect("/dashboard");    
        }
    }); 
});

//=======================


//DELETE PROJECTS

app.delete("/dashboard/:id",function(req,res){
    App.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/dashboard");
        } else {
            res.redirect("/dashboard");
        }
    }); 
});

//===============


//UPDATE PAYMENTS

app.get("/payments/:id",function(req,res){
     
    App.findById(req.params.id,function(err,sending){
        if(err){
            console.log(err);
        } else {
            res.render("editpayment",{sending:sending});        
        }
   });
});

app.put("/editpayment/:id",function(req,res){
    App.findByIdAndUpdate(req.params.id,req.body.edit,function(err,updated){
        if(err){
            res.redirect("/payments");
        }  else {
            res.redirect("/payments");    
        }
    });
});

//======================


//ADMIN REPORTS

app.get("/adminreport",function(req,res){
    res.render("adminreport");
}); 

//=============


//DEVELOPERS DASHBOARD

app.get("/dashboard2",ensureAuthenticated,function(req,res){
    App.find({},function(err,all){
        if(err){
            console.log(err);   
        }else {
            res.render("developer",{all:all});
            }
    });  
});

//=====================


//DEVELOPERS REPORT

app.get("/developerreport",function(req,res){
    
    res.render("developerreport");
}); 

//====================


//DEVELOPERS SEARCH

app.post("/gettingg",function(req,res){
    if(req.body.info){
        var day = req.body.info;
        App.find({id:day},function(err,all){
            if(err){
                console.log(err);
            } else {
                res.render("developer",{all:all});
            }
        });
    } else {
        res.redirect("/dashboard2");
    }     
});

//=================


//SERVER

app.listen(port, function(req,res){
    console.log("SERVER STARTS AT PORT 3003");
});
