interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
}
(function(){
    const $ = (query: string):HTMLInputElement | null => document.querySelector(query);
    
    function calcTepmpo(mil: number){
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);

        return `${min}m e ${sec}s`;
    }

    function patio(){
        function read(): Veiculo[]{
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        function save(veiculos: Veiculo[]) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }

        function add(veiculo: Veiculo, salva?: boolean) {
            const row = document.createElement("tr");
            const date = new Date();
            
            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${new Intl.DateTimeFormat('pt-BR').format(new Date(veiculo.entrada.toString()))}</td>
            <td>
                <button class="delete" data-placa="${veiculo.placa}">X</button>
            </td>
            `;

            row.querySelector(".delete")?.addEventListener("click",function (){
                remove(this.dataset.placa)
            })

            $("#patio")?.appendChild(row);
            
            if(salva){ save([...read(),veiculo]); $("#nome")!.value = ''; $("#placa")!.value = ''; }
            
        }

        function remove(placa: string) {
            const { entrada, nome } = read().find(veiculo => veiculo.placa === placa);

            const tempo = calcTepmpo(new Date().getTime()  - new Date(entrada).getTime());

           if(!confirm(`O veiculo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) return;
           
           save(read().filter(veiculo => veiculo.placa !== placa));
           render();

        }


        function render() {
            $("#patio")!.innerHTML = "";
            const patio = read();

            if(patio.length) {
                patio.forEach(veiculo => add(veiculo));
            }
        }

        return {read, add, remove, save,render}
    }
    patio().render();
    $("#cadastrar")?.addEventListener("click",() => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;

        if(!nome || !placa){
            alert("Os campos nome e placa são obrigatórios");
            return;
        }

        patio().add({ nome, placa,entrada: new Date().toISOString() },true)
        
    });
})();