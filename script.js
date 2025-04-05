document.addEventListener("DOMContentLoaded", function () {
    // Setup variables
    const questions = document.querySelectorAll(".question");
    const totalQuestions = questions.length;
    let currentQuestionIndex = 0;
    let userAnswers = {};
    let isFullscreen = false;
    let quizStarted = false;

    // Timer setup - 30 minutes
    let timeLeft = 3*60 * 60;  // Changed to 30 minutes to match display
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
        q4: "B", // Zero
        q5: "B", // [ML²T⁻³]
        q6: "A", // Joule
        q7: "A", // Length
        q8: "A", // m/s
        q9: "D", // Mass, length, time, temperature, electric current
        q10: "A", // Distance
        q11: "A", // Density
        q12: "C", // m³
        q13: "A", // kg/m³
        q14: "B", // kg
        q15: "A", // kg m/s²
        q16: "C", // Dimensionless
        q17: "C", // kg m²/s²
        q18: "C", // Watt
        q19: "B", // radian
        q20: "A", // Displacement / Time
        q21: "A", // 273.15 K
        q22: "A", // N m
        q23: "C", // kg m/s
        q24: "C", // kg m/s²
        q25: "B", // No dimensions
        q26: "A", // Energy
        q27: "A", // Mass
        q28: "C", // Acceleration
        q29: "D", // kg m²/s³
        q30: "D", // kg m²/s³
        q31: "C", // kg m²/s²
        q32: "A", // kg⁻¹ m⁻² s⁴ A²
        q33: "A", // kg m²/s³ A
        q34: "B", // Scalar
        q35: "A", // N/A²
        q36: "A", // kg m²/s² A
        q37: "C", // m²
        q38: "C", // Volt
        q39: "A", // kg m³/s³ A
        q40: "A", // Ampere
        q41: "D", // Coulomb
        q42: "A", // kg⁻¹ m⁻³ s⁴ A²
        q43: "A", // J/kg
        q44: "A", // [MT⁻²A⁻¹]
        q45: "A", // N/C
        q46: "C", // [M⁻¹L⁻²T⁴A²]
        q47: "C", // Torque and energy
        q48: "A", // Joule
        q49: "D", // [ML²T⁻³]
        q50: "C", // [ML²T⁻³A⁻¹]
        q51: "A", // N/m²
        q52: "A", // Torque
        q53: "A", // [ML²T⁻²]
        q54: "C", // Strain
        q55: "A", // [T⁻¹]
        q56: "A", // Ns
        q57: "D", // Power
        q58: "C", // Farad
        q59: "B", // Dyne/cm²
        q60: "C", // Density
        q61: "C", // Joule
        q62: "A", // Tesla
        q63: "B", // Hertz
        q64: "A", // Power
        q65: "B", // Coulomb
        q66: "B", // [ML⁻¹T⁻²]
        q67: "D", // All of these
        q68: "B", // [ML³T⁻³A⁻²]
        q69: "A", // Pascal
        q70: "A", // [T⁻¹]
        q71: "C", // KW⁻¹
        q72: "A", // kg·m²
        q73: "D", // Watt
        q74: "B", // N/m²
        q75: "B", // J/m³
        q76: "A", // [ML²T⁻²K⁻¹]
        q77: "D", // Kelvin
        q78: "A", // Ns/m²
        q79: "C", // Work
        q80: "B", // C·m
        q81: "B", // Henry
        q82: "C", // Momentum
        q83: "D", // Kilogram
        q84: "A", // Radian
        q85: "B", // [M¹L⁰T⁻³K⁻⁴]
        q86: "D", // Volt
        q87: "D", // Both (A) and (B)
        q88: "D", // Heat capacity
        q89: "A", // Candela
        q90: "A", // Weber
        q91: "A", // J/K
        q92: "A", // Poise
        q93: "A", // Planck's constant
        q94: "D", // Momentum
        q95: "A", // J
        q96: "B", // rad/s²
        q97: "C", // Both (A) and (B)
        q98: "B", // Power
        q99: "B", // Siemens
        q100: "B" // Henry per meter

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
    document.getElementById("fullscreenBtn").addEventListener("click", function () {
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
    document.getElementById("startQuizBtn").addEventListener("click", function () {
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

    submitBtn.addEventListener("click", function () { submitQuiz(false); });

    // Initialize the quiz - but don't start timer yet
    showQuestion(0);
    // updateTimer() is now only called when quiz actually starts
});
