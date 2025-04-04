document.addEventListener("DOMContentLoaded", function () {
    // Setup variables
    const questions = document.querySelectorAll(".question");
    const totalQuestions = questions.length;
    let currentQuestionIndex = 0;
    let userAnswers = {};
    let isFullscreen = false;
    let quizStarted = false;

    // Timer setup - 30 minutes
    let timeLeft = 30*60;  // Changed to 30 minutes to match display
    const timerElement = document.getElementById("timer");

    // Navigation buttons
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementById("submitBtn");
    const resultDiv = document.getElementById("result");

    // Question navigation panel
    const rightBox = document.querySelector(".right.box");

    // Correct answers
    const correctAnswers = {
        q1: "A", // [ML²T⁻¹]
        q2: "C", // Mass, length, and time
        q3: "A", // Power
        // ... remaining answers unchanged
        q100: "B", // Henry per meter
    };

    // Create quiz prerequisites panel
    const quizContainer = document.querySelector(".container");
    const prerequisiteDiv = document.createElement("div");
    prerequisiteDiv.classList.add("prerequisite");
    prerequisiteDiv.innerHTML = `
        <div class="prerequisite-box">
            <h2>Quiz Prerequisites</h2>
            <p>Before starting the quiz, please ensure:</p>
            <ul>
                <li id="fullscreen-check">✗ Quiz must be in fullscreen mode</li>
                <li id="flightmode-check">✗ Device must be in flight/airplane mode</li>
            </ul>
            <button id="startQuizBtn" disabled>Start Quiz</button>
            <button id="fullscreenBtn">Enter Fullscreen</button>
            <p id="flightmode-instruction">Please enable flight/airplane mode on your device, then click below to confirm</p>
            <button id="checkFlightModeBtn">I've Enabled Flight Mode</button>
        </div>
    `;
    
    // Insert prerequisite div before the container
    document.body.insertBefore(prerequisiteDiv, quizContainer);
    quizContainer.style.display = "none";
    document.querySelector(".heading").style.display = "none";
    
    // Fullscreen functionality
    document.getElementById("fullscreenBtn").addEventListener("click", function() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    });
    
    // Check flight mode button
    document.getElementById("checkFlightModeBtn").addEventListener("click", checkFlightMode);
    
    // Start quiz button
    document.getElementById("startQuizBtn").addEventListener("click", function() {
        prerequisiteDiv.style.display = "none";
        quizContainer.style.display = "flex";
        document.querySelector(".heading").style.display = "flex";
        quizStarted = true;
        updateTimer(); // Start the timer only when quiz starts
    });
    
    // Fullscreen change detection
    document.addEventListener("fullscreenchange", updateFullscreenStatus);
    document.addEventListener("webkitfullscreenchange", updateFullscreenStatus);
    document.addEventListener("mozfullscreenchange", updateFullscreenStatus);
    document.addEventListener("MSFullscreenChange", updateFullscreenStatus);
    
    // Network status detection
    window.addEventListener("online", checkQuizViolation);
    
    function updateFullscreenStatus() {
        isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                         document.mozFullScreenElement || document.msFullscreenElement);
        
        const fullscreenCheck = document.getElementById("fullscreen-check");
        if (isFullscreen) {
            fullscreenCheck.innerHTML = "✓ Quiz is in fullscreen mode";
            fullscreenCheck.style.color = "green";
        } else {
            fullscreenCheck.innerHTML = "✗ Quiz must be in fullscreen mode";
            fullscreenCheck.style.color = "red";
            
            if (quizStarted) {
                checkQuizViolation();
            }
        }
        
        updateStartButton();
    }
    
    function checkFlightMode() {
        const isOffline = !navigator.onLine;
        const flightmodeCheck = document.getElementById("flightmode-check");
        
        if (isOffline) {
            flightmodeCheck.innerHTML = "✓ Device is in flight/airplane mode";
            flightmodeCheck.style.color = "green";
        } else {
            flightmodeCheck.innerHTML = "✗ Device must be in flight/airplane mode";
            flightmodeCheck.style.color = "red";
        }
        
        updateStartButton();
    }
    
    function updateStartButton() {
        const startBtn = document.getElementById("startQuizBtn");
        if (isFullscreen && !navigator.onLine) {
            startBtn.disabled = false;
        } else {
            startBtn.disabled = true;
        }
    }
    
    function checkQuizViolation() {
        if (quizStarted) {
            if (!isFullscreen || navigator.onLine) {
                // Auto-submit quiz due to violation
                submitQuiz(true);
            }
        }
    }

    // Initialize question navigation buttons
    for (let i = 1; i <= totalQuestions; i++) {
        let btn = document.createElement("button");
        btn.classList.add("btn");
        btn.textContent = i;
        btn.addEventListener("click", function () {
            showQuestion(i - 1);
        });
        rightBox.appendChild(btn);
    }

    // Track answer changes
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function () {
            const questionName = this.name;
            const questionNumber = parseInt(questionName.substring(1)) - 1;
            userAnswers[questionName] = this.value;

            // Update the navigation button to show it's been answered
            document.querySelectorAll('.right.box .btn')[questionNumber].classList.add('answered');
        });
    });

    // Function to display a specific question
    function showQuestion(index) {
        questions.forEach((q, i) => {
            q.style.display = i === index ? "block" : "none";
        });

        // Update navigation buttons
        prevBtn.style.display = index === 0 ? "none" : "inline-block";
        nextBtn.style.display = index === questions.length - 1 ? "none" : "inline-block";
        submitBtn.style.display = index === questions.length - 1 ? "block" : "none";

        // Update the active question button
        document.querySelectorAll('.right.box .btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });

        currentQuestionIndex = index;
    }

    // Initialize timer
    function updateTimer() {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (timeLeft > 0) {
            timeLeft--;
            setTimeout(updateTimer, 1000);
        } else {
            // Time's up - auto submit
            submitQuiz();
        }
    }

    // Submit the quiz
    function submitQuiz(violation = false) {
        let score = 0;
        let answeredCount = 0;

        // Calculate score
        for (let key in correctAnswers) {
            if (userAnswers[key]) {
                answeredCount++;
                if (userAnswers[key] === correctAnswers[key]) {
                    score++;
                }
            }
        }

        // Display result
        const timeExpired = timeLeft <= 0;
        resultDiv.innerHTML = `
            <h2>Quiz Results</h2>
            <p>Your Score: ${score}/${totalQuestions}</p>
            <p>Questions Answered: ${answeredCount}/${totalQuestions}</p>
            ${timeExpired ? '<p>Time Expired!</p>' : ''}
            ${violation ? '<p>Quiz rules violated! Quiz auto-submitted.</p>' : ''}
            <h3>Question Summary</h3>
            <div id="question-summary"></div>
        `;
        
        // Create and append question summary
        const summaryDiv = document.getElementById("question-summary");
        for (let i = 1; i <= totalQuestions; i++) {
            const qKey = `q${i}`;
            const userAnswer = userAnswers[qKey] || "Not Attempted";
            const isCorrect = userAnswers[qKey] === correctAnswers[qKey];
            const wasAttempted = userAnswers[qKey] !== undefined;
            
            let statusClass = "not-attempted";
            let statusText = "Not Attempted";
            
            if (wasAttempted) {
                if (isCorrect) {
                    statusClass = "correct";
                    statusText = "Correct";
                } else {
                    statusClass = "incorrect";
                    statusText = "Incorrect";
                }
            }
            
            const questionSummary = document.createElement("div");
            questionSummary.className = `question-result ${statusClass}`;
            questionSummary.innerHTML = `
                <p>Question ${i}: <span class="${statusClass}">${statusText}</span></p>
                <p>Your Answer: ${userAnswer}</p>
                <p>Correct Answer: ${correctAnswers[qKey]}</p>
            `;
            summaryDiv.appendChild(questionSummary);
        }
        
        // Add styles for the question summary
        const styleEl = document.createElement("style");
        styleEl.textContent = `
            #question-summary {
                max-height: 400px;
                overflow-y: auto;
                margin-top: 20px;
            }
            .question-result {
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 10px;
                margin-bottom: 10px;
                background-color: #f9f9f9;
            }
            .correct {
                color: green;
                font-weight: bold;
            }
            .incorrect {
                color: red;
                font-weight: bold;
            }
            .not-attempted {
                color: orange;
                font-weight: bold;
            }
        `;
        document.head.appendChild(styleEl);
        
        resultDiv.style.display = "block";

        // Disable all inputs and buttons
        document.querySelectorAll("input[type=radio]").forEach(input => {
            input.disabled = true;
        });

        prevBtn.disabled = true;
        nextBtn.disabled = true;
        submitBtn.disabled = true;

        document.querySelectorAll('.right.box .btn').forEach(btn => {
            btn.disabled = true;
        });
        
        // End quiz state
        quizStarted = false;
    }

    // Event listeners
    prevBtn.addEventListener("click", function () {
        if (currentQuestionIndex > 0) {
            showQuestion(currentQuestionIndex - 1);
        }
    });

    nextBtn.addEventListener("click", function () {
        if (currentQuestionIndex < questions.length - 1) {
            showQuestion(currentQuestionIndex + 1);
        }
    });

    submitBtn.addEventListener("click", function() { submitQuiz(false); });

    // Initialize the quiz - but don't start timer yet
    showQuestion(0);
    // updateTimer() is now only called when quiz actually starts
});
