const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.get("/user/:handle", (req, res) => {
    let handle = req.params.handle;
    if (users.has(handle)) {
        res.send(users.get(handle));
    }
    else {
        res.send("User " + handle + " is NOT found.");
    }
});

app.post("/user/:handle", (req, res) => {
    let handle = req.params.handle;
    if (!users.get(handle)) {
        const name = req.body.name;
        const email = req.body.email;
        if (!!name && !!email) {
            users.set(handle, {
                "id": ids++,
                "handle": handle, 
                "name": name, 
                "email": email,
                "coins": 10
            });
            res.send({"status": "OK", "message": "User " + handle + " created."});
        }
        else {
            res.send("The fields are not filled in.");
        }
    }
    else {
        res.send("This user already created!");
    }
});

app.put("/user/:handle", (req, res) => {
    let handle = req.params.handle;
    const name = req.body.name;
    const email = req.body.email;
    if (users.has(handle)) {
        let user = users.get(handle);
        const data = {
            "id": user.id,
            "handle": user.handle, 
            "name": name, 
            "email": email, 
            "coins": user.coins
        };
        users.set(handle, data);
        res.send({"status": "OK", "message": "User " + handle + " has been updated."});
    }
    else {
        res.send({"status": "ERROR", "message": "User " + handle + " is NOT found."});
    }
});

app.delete("/user/:handle", (req, res) => {
    let handle = req.params.handle;
    users.delete(handle);
    res.send("User " + handle + " deleted.");
});

app.listen(port, () => {
    console.log(`Example web server listening on port ${port}.`);
});

app.post("/transfer/:from/:to/", (req, res) => {
    const from = req.params.from;
    const to = req.params.to;
    
    const user_from = users.get(from);
    const user_to = users.get(to);

    if (!!user_from && !!user_to) {
        const coins = req.body.coins;
        if (coins > 0) {
            if (user_from.coins - coins >= 0) {

                user_from.coins -= coins;
                user_to.coins += coins;

                console.log(user_from);
                console.log(user_to);

                users.set(from, user_from);
                users.set(to, user_to);

                res.send({"status": "OK", "message": "Операция завершена успешно."});
            }
            else {
                res.send({"status": "ERROR", "message": "На счёте " + from + " недостаточно монет."});
            }
        }
        else {
            res.send({"status": "ERROR", "message": "Количество монет должно быть больше нуля."});
        }
    }
    else {
        res.send({"status": "ERROR", "message": "Одного или нескольких пользователей не существует."});
    }
});

const DATABASE = { "mail@mail.mail": { "password": "123" } };

app.post("/login", (req, res) => {
    try {
        const data = req.body;
        console.log(data["email"])
        if (DATABASE[data["email"]] !== undefined)
            if (data["password"] === DATABASE[data["email"]]["password"])
                res.send({ status: "OK" });
            else
                res.send({ status: "ERROR", message: "Invalid password" })
        else
            res.send({ status: "ERROR", message: "User not found" })
    } catch (e) {
        throw new Error(e);
    }
});
