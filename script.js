(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTepmpo(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    function patio() {
        function read() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function save(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        function add(veiculo, salva) {
            var _a, _b;
            const row = document.createElement("tr");
            const date = new Date();
            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td>
                <button class="delete" data-placa="${veiculo.placa}">X</button>
            </td>
            `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remove(this.dataset.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salva) {
                save([...read(), veiculo]);
                $("#nome").value = '';
                $("#placa").value = '';
            }
        }
        function remove(placa) {
            const { entrada, nome } = read().find(veiculo => veiculo.placa === placa);
            const tempo = calcTepmpo(new Date().getTime() - new Date(entrada).getTime());
            if (!confirm(`O veiculo ${nome} permaneceu por ${tempo}. Deseja encerrar?`))
                return;
            save(read().filter(veiculo => veiculo.placa !== placa));
            render();
        }
        function render() {
            $("#patio").innerHTML = "";
            const patio = read();
            if (patio.length) {
                patio.forEach(veiculo => add(veiculo));
            }
        }
        return { read, add, remove, save, render };
    }
    patio().render();
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert("Os campos nome e placa são obrigatórios");
            return;
        }
        patio().add({ nome, placa, entrada: new Date().toISOString() }, true);
    });
})();
