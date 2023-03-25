let terningEl = document.querySelector('#terning')
let redemptionBtn = document.querySelector('#redemption')
let straffeBtn = document.querySelector('#straffekast')
let timerBtn = document.querySelector('#timer')
let comEl = document.querySelector('#com')
let bodyEl = document.getElementsByTagName('body')[0]
let stressAu = document.querySelector('#stressAu')
let ferdigAu = document.querySelector('#ferdigAu')
let situasjonAu = document.querySelector('#situasjonAu')
let reglerBtn = document.querySelector('#regler')
let reglerEl = document.querySelector('#reglerTxt')
let tempoEls = document.querySelectorAll('.tempo button')
let lyderEls = document.querySelectorAll('.lyder button')
let audioEls = document.querySelectorAll('.audios audio')


let vanligArr = ["stressmusikk.mp3", "duck.mp3", "carhorn.mp3"]
let sigmaArr = ["heartSong.mp3", "sigmaSound.mp3", "tiger.mp3"]

let tempo = 1
tempoEls[1].classList.add('checked')
for(let i=0; i<tempoEls.length; i++){
    tempoEls[i].addEventListener('click', function(){
        for(let j=0; j<tempoEls.length; j++){
            tempoEls[j].classList.remove('checked')
        }
        tempoEls[i].classList.add('checked')
        tempo = i
    })
}
tempoEls[1].classList.add('checked')

lyderEls[0].classList.add('checked')
lyderEls[1].classList.remove('checked')
lyderEls[0].onclick = function(){
    lyderEls[0].classList.add('checked')
    lyderEls[1].classList.remove('checked')
    for(let i=0; i<audioEls.length; i++){
        console.log(`${audioEls[i].src} = ./terninger/lyder/${vanligArr[i]}`)
        audioEls[i].src = `./terninger/lyder/${vanligArr[i]}`
    }
}
lyderEls[1].onclick = function(){
    console.log("sigma aktivert")
    lyderEls[1].classList.add('checked')
    lyderEls[0].classList.remove('checked')
    for(let i=0; i<audioEls.length; i++){
        console.log(`${audioEls[i].src} = ./terninger/lyder/${sigmaArr[i]}`)
        audioEls[i].src = `./terninger/lyder/${sigmaArr[i]}`
    }
}

terningEl.addEventListener('click', kast)
redemptionBtn.addEventListener('click', redemption)
timerBtn.addEventListener('click', timer)
straffeBtn.addEventListener('click', straffekast)

reglerBtn.onclick = function(){
    console.log("regler klikk")
    reglerEl.classList.toggle('vis')
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Liste over terningbildene
let terninger = ['en2', 'to2', 'tre2', 'fire2', 'fem2', 'seks2']

let situasjonerArr
fetch("situasjoner.json")
    .then(res => res.json())
    .then(situasjon => {
        situasjonerArr = situasjon
})

let terningNr = Math.floor(Math.random()*6)
terningEl.src = `./terninger/${terninger[terningNr]}.png`

async function situasjon(){
    // Bestemmer et tilfeldig tall
    let situasjonNr = Math.floor(Math.random()*(situasjonerArr.length/* *10 */))
    // Hvis tilfeldig tall er mindre enn antall situasjoner, situasjonen popper opp
    if (situasjonNr < situasjonerArr.length){
        situasjonAu.play()
        comEl.innerHTML = situasjonerArr[situasjonNr].situasjon
        terningEl.removeEventListener('click', kast)
        console.log("situasjontid = " + situasjonerArr[situasjonNr].tid)
        await sleep(situasjonerArr[situasjonNr].tid*1000)
        console.log("klar til kast")
        terningEl.addEventListener('click', kast)
    }
}

// Kaster terningen
async function kaster(){
    terningEl.removeEventListener('click', kast)
    // Rullerer gjennom terninger imens kast
    for(i=50; i<250; i=i+50){
        let midlTerningNr = Math.floor(Math.random()*6)
        terningEl.src = `./terninger/${terninger[midlTerningNr]}.png`
        terningEl.classList.toggle('rist')
        terningNr = midlTerningNr
        await sleep(i)
    }

    // Hvis triller 1 eller 6 står det "neste person"
    if(terningNr == 0 || terningNr == 5){
        comEl.innerHTML = `Neste person!`
    }
    terningEl.addEventListener('click', kast)
}
async function kast(){
    if (canRoll == true){
        console.log("kaster nu")
        // Hvis timeren er på vil den kaste
        comEl.innerHTML = `Kast 6 eller 1`
        await kaster()
        situasjon()
    }

}

let canRoll = false
async function timer(){
    canRoll = true
    stressAu.currentTime = 0
    stressAu.play()
    straffesum = 0
    // Ikke mulig å skru på timer
    timerBtn.removeEventListener('click', timer)
    timerBtn.innerHTML = "kast!"
    // Mulig å kaste
    bodyEl.style.backgroundColor = "rgb(175, 75, 75)"
    comEl.innerHTML = `Kast 6 eller 1`
    // Setter tilfeldig tid
    let tid
    if(tempo == 0){
        tid = Math.floor(Math.random()*30)+30
    }else if(tempo == 1){
        tid = /* Math.floor(Math.random()*30)+15 */10
    }else if(tempo == 2){
        tid = Math.floor(Math.random()*30)
    }
    console.log(tid)
    // Timer
    while (tid>0){
        /* console.log(tid) */
        await sleep(1000)
        tid--
    }
    bodyEl.style.backgroundColor = "rgb(57, 137, 90)"

    comEl.innerHTML = `Tiden er ute!`
    timerBtn.innerHTML = "start timer"
    timerBtn.addEventListener('click', timer)
    // Lov å bruke redemption
    redemptionBtn.style.display = 'block'
    timerBtn.style.display = 'none'
    stressAu.pause()
    ferdigAu.play()
    canRoll = false
}
// Redemption kast
async function redemption(){
        ferdigAu.pause()
        await kaster()
        console.log(`TerningNr = ${terningNr}`)
        if (terningNr > 0 && terningNr < 5){
            comEl.innerHTML = `Du tapte!`
            straffeBtn.style.display = 'block'
            redemptionBtn.style.display = 'none'
            bodyEl.style.backgroundColor = "rgb(187, 137, 49)"
        }
}
let straffesum
async function straffekast(){
    console.log(`straffesum = ${straffesum}`)
    await kaster()
    straffesum += terningNr+1
    if (terningNr == 5){
        comEl.innerHTML = `Kast igjen!`
    }
    else if (terningNr == 0){
        comEl.innerHTML = `Du skal downe!`
        straffeBtn.style.display = 'none'
        timerBtn.style.display = 'block'
    }
    else{
        comEl.innerHTML = `Du skal ta ${straffesum}!`
        straffeBtn.style.display = 'none'
        timerBtn.style.display = 'block'
    }
}