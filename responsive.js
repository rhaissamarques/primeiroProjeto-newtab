// Para a soma dos resultados
let numeroS = 0.0;

let divEmpty = 0;

let dataLocal = JSON.parse(localStorage.getItem("dados"));

// checa se o Local Storage está vazio
if (dataLocal) {
    for(i=0;i<dataLocal.length;i++) {
        AddTrans(dataLocal[i]["Produto"],dataLocal[i]["Value"],dataLocal[i]["tipoCompraOuVenda"]);
    }
} else {
    document.getElementById("resultado").innerHTML =`
        <div class="merc" style="width: 100%; text-align: center;">
            <span style="width: 100%;"> Nenhuma transação cadastrada</span>
        </div>
        `;
    document.getElementById("valorValorTotal").innerHTML ="R$ 0,00";
    document.getElementById("lucroOuPrejuizo").innerHTML = "";
    divEmpty = 1;
    dataLocal = [];
}

// Abre Fecha Menu
function hambMenu() {
    document.getElementById("menuHeader").style.display = "flex";
}

function closeMenu() {
    document.getElementById("menuHeader").style.display = "none";
}

// Hamburger menu
function myFunction(x) {
    if (x.matches) {
        document.getElementById("menuHeader").style.display = "flex";
    } else {
        document.getElementById("menuHeader").style.display = "none";
    }
}
var x = window.matchMedia("(min-width: 800px)"); // vira o menu na parte superior na versão desktop
myFunction(x);
x.addListener(myFunction);


// Validação do Formulário
function validaForm() {
    data = {
        "Produto":document.getElementById("nameMercadoria").value,
        "Value":document.getElementById("valorMercadoria").value,
        "tipoCompraOuVenda":document.getElementById("compraVenda").value
    }

    // Verifica se o Form está preenchido
    if (data["Produto"] == '') {
        document.getElementById("erroMercadoria").style.display = "block";
        return false;
    } else {
        document.getElementById("erroMercadoria").style.display = "none";
        if (data["Value"] == '') {
            document.getElementById("erroValor").style.display = "block";
            return false;
        } else {
            document.getElementById("erroValor").style.display = "none";
            AddTrans(data["Produto"],data["Value"],data["tipoCompraOuVenda"]);
            document.querySelector("form").reset();
            num = "";
            dataLocal.push(data);
            localStorage.setItem("dados", JSON.stringify(dataLocal));
            return false;
        }
    }
    
}


// Soma
function AddTrans(Produto,Value,Simbolo) {
    var sign = "+";
    if (Simbolo == "1") {
        sign = "-"
    }
    if (divEmpty == 1) {
        document.getElementById("resultado").innerHTML=""
        divEmpty = 0
    }
    document.getElementById("resultado").innerHTML +=`
    <div class="merc">
            <span>`+ sign +` `+ Produto +`</span>
            <span>R$ `+ Value +`</span>
        </div>
    `

    if (Simbolo == "1") {
        numeroS += parseFloat(Value.replace(".","").replace(",","."))*(-1.0);
    } else {
        numeroS += parseFloat(Value.replace(".","").replace(",","."));
    }

    let somaNumero = applyMask(numeroS.toFixed(2).toString().replace("-","").replace(".",""));
    document.getElementById("valorValorTotal").innerHTML = "R$ " + somaNumero;

    if(numeroS < 0.0) {
        document.getElementById("lucroOuPrejuizo").innerHTML = "[PREJUÍZO]";
    } else if (numeroS == 0.0) {
        document.getElementById("lucroOuPrejuizo").innerHTML = "";
    } else {
        document.getElementById("lucroOuPrejuizo").innerHTML = "[LUCRO]";
    }
}


// Mascara para o valor só aceitar números
function applyMask(num) {
    let value = "";
    if (num.length == 0) {
        value = "";
    } else if (num.length < 2) {
        value = "0,0" + num;
    } else if (num.length < 3) {
        value = "0," + num;
    } else {
        let divi = (num.length - 2) / 3;
        let pontoDivi = divi.toString().split('.');
        if ( divi <= 1) {
            value = num.slice(0, -2) + ',' + num.slice(-2);
        } else {
            let numPoint = ""
            if(Number.isInteger(divi)) {
                for(let i=0;i<(parseInt(pontoDivi[0],10)-1);i++) {
                    let numRest = ((num.length - 2) % 3) + (i*3);
                    numPoint += "." + num.slice((numRest),(numRest+3));
                }
                value = num.slice(0, 3) + numPoint + ',' + num.slice(-2);
            } else {
                for(let i=0;i<parseInt(pontoDivi[0],10);i++) {
                    let numRest = ((num.length - 2) % 3) + (i*3);
                    numPoint += "." + num.slice((numRest),(numRest+3));
                }
                let restNum = (num.length - 2) % 3
                value = num.slice(0, restNum) + numPoint  + ',' + num.slice(-2);
            }
        }
    }
    return value;
}


// Mapeamento do teclado no input do Valor
const input = document.getElementById("valorMercadoria");
let num = "";
function checkNum(e) {
    e.preventDefault();
    if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace"].indexOf(e.key) == -1) {
        console.log("Letra: " + e.key);
    } else {
        num += e.key;
        if (e.key == "Backspace") {
            num = num.slice(0, -10);
        }
        e.target.value = applyMask(num);
    }
}
input.addEventListener('keydown', checkNum);

// Pop-up
function openPoup () {
    if (!(x.matches)) {
        document.getElementById("menuHeader").style.display = "none";
    }
    document.getElementById("contentBody").style.visibility = "hidden";
    document.getElementById("idPopUp").style.display = "flex";
}

// Limpar
function clearData () {
    localStorage.clear();
    document.getElementById("resultado").innerHTML =`
        <div class="merc" style="width: 100%; text-align: center;">
            <span style="width: 100%;"> Insira um valor de transação</span>
        </div>
        `;
    document.getElementById("valorValorTotal").innerHTML = "R$ 0,00";
    document.getElementById("lucroOuPrejuizo").innerHTML = "";
    divEmpty = 1;
    dataLocal = [];
    closePoup();
}

// Fechar
function closePoup () {
    // document.getElementById("contentBody").style.opacity = "1.0";
    document.getElementById("contentBody").style.visibility = "visible";
    document.getElementById("idPopUp").style.display = "none";
}

// Salvar informações no servidor
const aluno = "0669"; //CPF
function saveServidor() {
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
    headers: {
        Authorization: "Bearer key2CwkHb0CKumjuM"
        }
    })
    .then((response) => {return response.json()})
    .then((responseJson) => {
        exist = responseJson.records.filter((record) => {
            if (aluno == record.fields.Aluno) {
                return true
            }
            return false
        })
        if (exist.length == 0) {
            insertData()
        } else {
            updateData(exist[0].id)
        }
    })
}

// Criar dados no servidor
function insertData() {
    let jsonData = JSON.stringify(dataLocal);
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
        method: "POST",
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM",
            "Content-Type" : "application/json"
            },
        body: JSON.stringify({
            "records": [
                {
                "fields": {
                    "Aluno": aluno,
                    "Json": jsonData
                    }
                }
            ]
        })
    })
}

// Atualizar dados no servidor
function updateData(id) {
    let jsonData = JSON.stringify(dataLocal);
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
        method: "PATCH",
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM",
            "Content-Type" : "application/json"
            },
        body: JSON.stringify({
            "records": [
                {
                "id": id,
                "fields": {
                    "Aluno": aluno,
                    "Json": jsonData
                    }
                }
            ]
        })
    })
}