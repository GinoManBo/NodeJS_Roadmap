const http = require("http");

const server = http.createServer((req, res) => {

	if (req.url === '/') {
	res.write("Pagina principal");
}
	if (req.url === '/notas') {
	res.write("Pagina de notas");
}
	if (req.url === '/usuarios') {
	res.write("Pagina de usuarios");
}
	if (req.url === '/resumen') {
	res.write("Pagina de Resumen/Kpi's");
}

	if (req.url === '/exit') {
	res.write("Hasta luego!");
	
}
	if (req.url === '/tareas') {
	res.wirte("Estas son mis tareas");
}

res.end();

});

server.listen(3000, () => {
	console.log("Servidor corriendo");
});


