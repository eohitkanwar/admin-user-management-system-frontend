const socket = io.connect("http://localhost:3000");

socket.on("message", function (data) {
  let chat = document.getElementById("chat");
  chat.innerHTML += `<p> ${data.message}</p>`;
});

function sendMessage() {
  let input = document.getElementById("messageInput");
  let msg = input.value;
  socket.emit("send", { message: msg });
  input.value = "";
}
