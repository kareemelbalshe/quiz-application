let countSpan=document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea=document.querySelector(".quiz-area");
let answerArea=document.querySelector(".answers-area");
let submitBetton=document.querySelector(".submit-button");
let bullets= document.querySelector(".bullets");
let resultsContainer=document.querySelector(".results");
let countdownElement=document.querySelector(".countdown");


let currentIndex=0;
let rightAnswers = 0;
let countdownInterval;


function getQuestions(){
    let myRequest=new XMLHttpRequest();
    myRequest.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            let questionsObject =JSON.parse(this.responseText);
            let qCount = questionsObject.length;

            createBulles(qCount);

            addQuestionDate(questionsObject[currentIndex],qCount);

            countdown(5, qCount);
            submitBetton.onclick=function(){
                let theRightAnswer=questionsObject[currentIndex].right_answer;

                currentIndex++;

                checkAnswer(theRightAnswer, qCount);

                quizArea.innerHTML="";
                answerArea.innerHTML="";
                addQuestionDate(questionsObject[currentIndex],qCount);

                handleBullets();

                clearInterval(countdownInterval);
                countdown(5, qCount);

                showResults(qCount);

            };
        }
    };
    myRequest.open("get", "html-question.json",true);
    myRequest.send();
}
getQuestions();

function createBulles(num){
    countSpan.innerHTML = num;

    for(let i=0;i<num;i++){
        let theBullet = document.createElement("span");

        if(i === 0){
            theBullet.className = "on";
        }
        bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionDate(obj,count){
if(currentIndex<count){



    let questionTitle=document.createElement("h2");

    let questionText=document.createTextNode(obj["title"]);

    questionTitle.appendChild(questionText);

    quizArea.appendChild(questionTitle);

    for(let i =1;i<=4;i++){
        let mainDiv= document.createElement("div");
        mainDiv.className='answer';
        let radioInput=document.createElement("input");

        radioInput.name='question';
        radioInput.type='radio';
        radioInput.id=`answer_${i}`;
        radioInput.dataset.answer=obj[`answer_${i}`];

        let theLabel=document.createElement("label");
        theLabel.htmlFor=`answer_${i}`;

        let theLabelText=document.createTextNode(obj[`answer_${i}`]);

        theLabel.appendChild(theLabelText);

        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);

        answerArea.appendChild(mainDiv);
        if(i===1){
            radioInput.checked=true;
        }
    }
    }
}

function  checkAnswer(rAnswer,count){
let answers=document.getElementsByName("question");
let theChoosenAnswer;
for(let i=0;i<answers.length;i++){
if(answers[i].checked){
    theChoosenAnswer=answers[i].dataset.answer;
}
}

if(rAnswer===theChoosenAnswer){
rightAnswers++;
}
}

function handleBullets(){
    let bulletsSpans=document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans= Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index)=>{
        if(currentIndex===index){
            span.className="on";
        }
    });
}
function showResults(count){
    let theResults;
    if(currentIndex===count){
        quizArea.remove();
        answerArea.remove();
        submitBetton.remove();
        bullets.remove();
        if(rightAnswers>(count / 2)&&rightAnswers<count){
            theResults=`<span class="good">Good</span>, ${rightAnswers} from ${count} is Good.`;
        }
        else if(rightAnswers===count){
            theResults=`<span class="perfect">Perfect</span>, ${rightAnswers} from ${count} is Perfect.`;
        }
        else{
            theResults=`<span class="bad">bad</span>, ${rightAnswers} from ${count} is bad.`;
        }
    }
    resultsContainer.innerHTML= theResults;
    resultsContainer.style.padding='10px';
    resultsContainer.style.backgroundColor='white';
    resultsContainer.style.marginTop='10px';
}
function countdown(duration, count){
    if(currentIndex<count){
        let minutes, seconds;
        countdownInterval=setInterval(function(){
            minutes=parseInt(duration /60);
            seconds=parseInt(duration % 60);

            minutes=minutes<10?`0${minutes}`: minutes;
            seconds=seconds<10?`0${seconds}`: seconds;

            countdownElement.innerHTML=`${minutes}:${seconds}`;
            if(--duration<0){
                clearInterval(countdownInterval);
                submitBetton.click();
            }
        }, 1000);
    }
}