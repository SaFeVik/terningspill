let terningEl = document.querySelector('#terning')
let redemptionBtn = document.querySelector('#redemption')
let straffeBtn = document.querySelector('#straffekast')
let timerBtn = document.querySelector('#timer')
let comEl = document.querySelector('#com')
let bodyEl = document.getElementsByTagName('body')[0]

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Liste over terningbildene
let terninger = ['en', 'to', 'tre', 'fire', 'fem', 'seks']
let terningNr
// Kaster terningen
function kaster(){
    terningNr = Math.floor(Math.random()*6)
    terningEl.src = `./terninger/${terninger[terningNr]}.png`
}

// Mulig å kaste førstegang
let kastMulig = true
async function kast(){
    // Hvis terningen ikke triller og timeren er på vil den kaste
    if (kastMulig == true && timerOn == true){
        comEl.innerHTML = `Kast 6 eller 1`
        // Ikke mulig å kaste imens
        kastMulig = false
        // Rullerer gjennom terninger imens kast
        for(i=0;i<200;i=i+50){
            kaster()
            terningEl.classList.toggle('rist')
            await sleep(i)
        }
        // Hvis triller 1 eller 6 står det "neste person"
        if(terningNr == 0 || terningNr == 5){
            console.log('6 eller 1')
            console.log(straffeOn)
            if (straffeOn == false){
                comEl.innerHTML = `Neste person`
            }
        }
        // Mulig å kaste igjen
        kastMulig = true
}}
let straffesum
// Timer er ikke på
let timerOn = false
async function timer(){
    straffesum = 0
    // Ikke mulig å skru på timer
    timerBtn.removeEventListener('click', timer)
    // Mulig å kaste
    timerOn = true
    bodyEl.style.backgroundColor = "rgb(175, 75, 75)"
    comEl.innerHTML = `Kast 6 eller 1`
    // Setter tilfeldig tid
    let tid = Math.floor(Math.random()*60)
    // Timer
    while (tid>0){
        console.log(tid)
        await sleep(1000)
        tid--
    }
    bodyEl.style.backgroundColor = "rgb(57, 114, 137)"
    // Lov å bruke timer igjen
    timerOn = false
    // Ikke 1 eller 6 når tiden er ute
    if (terningNr > 0 && terningNr < 5){
        comEl.innerHTML = `Tiden er ute! (taper)`
    }
    timerBtn.addEventListener('click', timer)
    // Lov å bruke redemption
    redemptionBtn.style.display = 'block'
    timerBtn.style.display = 'none'
}
// Ikke lov med redemption fra før av
async function redemption(){
        timerOn = true
        bodyEl.style.backgroundColor = "rgb(57, 137, 90)"
        kast()
        await sleep(1850)
        console.log("klar")
        console.log(`TerningNr = ${terningNr}`)
        if (terningNr > 0 && terningNr < 5){
            comEl.innerHTML = `Du tapte`
            straffeBtn.style.display = 'block'
            redemptionBtn.style.display = 'none'
            timerBtn.style.display = 'none'
        }
        timerOn = false

}
let straffeOn = false
async function straffekast(){
    bodyEl.style.backgroundColor = "rgb(187, 137, 49)"
    console.log(`straffesum = ${straffesum}`)
    timerOn = true
    straffeOn = true
    kast()
    await sleep(3000)
    straffesum += terningNr+1
    if (terningNr == 5){
        comEl.innerHTML = `Kast igjen`
    }
    else if (terningNr == 0){
        comEl.innerHTML = `Du skal downe`
        straffeBtn.style.display = 'none'
        redemptionBtn.style.display = 'none'
        timerBtn.style.display = 'block'
    }
    else{
        comEl.innerHTML = `Du skal ta ${straffesum}`
        straffeBtn.style.display = 'none'
        redemptionBtn.style.display = 'none'
        timerBtn.style.display = 'block'
    }
    straffeOn = false
    timerOn = false
}

redemptionBtn.addEventListener('click', redemption)
terningEl.addEventListener('click', kast)
timerBtn.addEventListener('click', timer)
straffeBtn.addEventListener('click', straffekast)
