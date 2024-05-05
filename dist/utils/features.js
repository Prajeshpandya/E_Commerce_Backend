import mongoose from "mongoose";
export const connDb = () => {
    mongoose
        .connect("mongodb://localhost:27017", { dbName: "E-Commerce" })
        .then((c) => {
        console.log(`DataBase Connected to ${c.connection.host}`);
    })
        .catch((e) => console.log(e));
};
