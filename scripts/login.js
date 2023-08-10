
const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit",async (e)=>{
    e.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
        let res = await fetch("https://reqres.in/api/login",{
            method : "POST",
            headers : {
                "Content-type":"application/json",
            },
            body : JSON.stringify({email,password})
        });

        if(res.ok){
            const data = await res.json();
            localStorage.setItem('token',data.token);
            alert("Login Successfull");
            window.location.href = "dashboard.html"
        }else{
            console.log({"error":"Error while logging in."})
        }
    } catch (error) {
        console.log(error)
    }
})

const adminPage = document.querySelector("#adminPage");
const authtoken = localStorage.getItem('token')
console.log(authtoken)

adminPage.addEventListener("click",()=>{
    if(authtoken==null){
        alert("Please login first")
    }else{
        window.location.href = "dashboard.html"
    }
})