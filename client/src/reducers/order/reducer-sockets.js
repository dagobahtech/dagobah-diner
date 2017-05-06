const io = require("socket.io-client");
const socket = io();

export default function(state=socket, action) {
    return state;
}