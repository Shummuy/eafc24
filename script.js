let participantes = ['Gabriel', 'Leonardo', 'Marlon'];
let times = {
    'Gabriel': [],
    'Leonardo': [],
    'Marlon': []
};
let confrontos = [];
let timeSobrando;

function gerarCamposTimes() {
    const container = document.getElementById('timesParticipante');
    container.innerHTML = '';

    participantes.forEach((participante) => {
        const div = document.createElement('div');
        div.innerHTML = `<h3>${participante}</h3>
                         <input type="text" id="time1-${participante}" placeholder="Time 1">
                         <input type="text" id="time2-${participante}" placeholder="Time 2">
                         <input type="text" id="time3-${participante}" placeholder="Time 3">`;
        container.appendChild(div);
    });
}

function sortearConfrontos() {
    let todosTimes = [];

    participantes.forEach((participante) => {
        let time1 = document.getElementById(`time1-${participante}`).value;
        let time2 = document.getElementById(`time2-${participante}`).value;
        let time3 = document.getElementById(`time3-${participante}`).value;

        if (time1 && time2 && time3) {
            times[participante] = [time1, time2, time3];
            todosTimes = todosTimes.concat([
                { time: time1, participante: participante },
                { time: time2, participante: participante },
                { time: time3, participante: participante }
            ]);
        } else {
            alert(`Por favor, preencha todos os times de ${participante}.`);
            return;
        }
    });

    document.getElementById('cadastroTimes').classList.add('hidden');
    document.getElementById('resultado').classList.remove('hidden');

    gerarConfrontos(todosTimes);
}

function gerarConfrontos(todosTimes) {
    let confrontosGerados = [];
    let tentativas = 0;
    let timesRestantes = [...todosTimes];

    // Gera os primeiros 3 confrontos
    while (confrontosGerados.length < 3 && timesRestantes.length > 1) {
        tentativas++;
        if (tentativas > 100) {
            alert("Não foi possível gerar confrontos válidos. Tente novamente.");
            break;
        }

        const time1 = timesRestantes.splice(Math.floor(Math.random() * timesRestantes.length), 1)[0];
        const time2 = timesRestantes.splice(Math.floor(Math.random() * timesRestantes.length), 1)[0];

        const participante1 = time1.participante;
        const participante2 = time2.participante;

        const maxConfrontos = confrontosGerados.filter(c => c.includes(participante1) && c.includes(participante2)).length;

        if (participante1 !== participante2 && maxConfrontos < 2) {
            confrontosGerados.push(`${time1.time} (${participante1}) vs ${time2.time} (${participante2})`);
        } else {
            timesRestantes.push(time1, time2);
        }
    }

    // Temos os últimos três times
    let [timeA, timeB, timeC] = timesRestantes;

    const participanteA = timeA.participante;
    const participanteB = timeB.participante;
    const participanteC = timeC.participante;

    // Precisamos garantir que o time que sobrar seja de um participante diferente dos dois últimos que jogarem
    if (participanteA !== participanteB) {
        confrontosGerados.push(`${timeA.time} (${participanteA}) vs ${timeB.time} (${participanteB})`);
        timeSobrando = timeC; // Sobrou o time de C
    } else if (participanteA !== participanteC) {
        confrontosGerados.push(`${timeA.time} (${participanteA}) vs ${timeC.time} (${participanteC})`);
        timeSobrando = timeB; // Sobrou o time de B
    } else {
        confrontosGerados.push(`${timeB.time} (${participanteB}) vs ${timeC.time} (${participanteC})`);
        timeSobrando = timeA; // Sobrou o time de A
    }

    // Verifica se o último confronto cumpre a regra de sobrar o participante certo
    const ultimoConfronto = confrontosGerados[confrontosGerados.length - 1];
    const participantesNoUltimoConfronto = ultimoConfronto.match(/\((.*?)\)/g).map(p => p.replace(/[()]/g, ''));
    if (participantesNoUltimoConfronto.includes(timeSobrando.participante)) {
        alert(`Erro: o último confronto não pode ter o time sobrando (${timeSobrando.participante}). Refaça o sorteio.`);
        return;
    }

    // Exibe confrontos na tela
    confrontosGerados.forEach((confronto) => {
        const li = document.createElement('li');
        li.textContent = confronto;
        document.getElementById('listaConfrontos').appendChild(li);
    });

    document.getElementById('timeSobrando').textContent = timeSobrando ? `${timeSobrando.time} (${timeSobrando.participante})` : 'Nenhum';
}
