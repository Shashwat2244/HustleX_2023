import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

const connectToDatabase = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/hustlex", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
};

connectToDatabase();

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})



const User = new mongoose.model("User", userSchema);


const patientSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    contact: Number,
    temp: Number,
    symptoms: String,
    doctor: String,
    disease: String

})

const Patient = new mongoose.model("Patient", patientSchema);


// Routes
app.post("/login", (req,res)=>{
    const {email, password} = req.body
   User.findOne({ email: email })
    .then(user => {
        if (user) {
            if (password === user.password) {
                res.send({ message: "Login Successful", user: user });
            } else {
                res.send({ message: "Wrong Password!" });
            }
        } else {
            res.send({ message: "User Not Registered!" });
        }
    })
    .catch(err => {
        res.send(err);
    });

})

app.post("/register", (req,res)=>{
   const { name, email, password } = req.body
   User.findOne({ email: email })
    .then(user => {
        if (user) {
            res.send({ message: "User Already Registered" });
        } else {
            const newUser = new User({
                name: name,
                email: email,
                password: password
            });

            return newUser.save();
        }
    })
    .then(() => {
        res.send({ message: "Successfully Registered, Please Login Now!" });
    })
    .catch(err => {
        res.send(err);
    });
   
})

app.post("/patient", (req,res)=>{
    const{ name, email, contact, address, temp, symptoms, disease, doctor} = req.body;
    const newPatient = new Patient({
        name: name,
        contact: contact,
        email: email,
        address: address,
        doctor: doctor,
        disease: disease,
        symptoms: symptoms,
        temp: temp
    });
    res.send({message: " Patient Added, Please Wait!"});
    return newPatient.save();
})


app.listen(9002, () =>{
    console.log("BE started at port 9002");
})

app.get("/getAllUser", async(req,res)=>{
    try{
        const allUser = await Patient.find({});
        res.send({status:"ok", data:allUser});
    }catch(error){
        console.log(error);
    }
})

app.post("/deleteUser", async (req, res) => {
    const { userid } = req.body;

    try {
        await Patient.deleteOne({ _id: userid });
        console.log("Patient deleted successfully");
        res.send({ status: "ok", data: "Deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: error.message });
    }
});