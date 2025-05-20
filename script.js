document.addEventListener("DOMContentLoaded", function () {
    // Setup variables
    const questions = document.querySelectorAll(".question");
    const totalQuestions = questions.length;
    let currentQuestionIndex = 0;
    let userAnswers = {};
    let quizStarted = false;
    const quizPassword = "exam123"; // Default password for the quiz

    // Timer setup - 30 minutes
    let timeLeft = 3 * 60 * 60;  // 3 hours in seconds
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
        q1: "D", // 4.0 g of hydrogen
        q2: "C", // C₂H₄O₃
        q3: "A", // 17.8 M
        q4: "D", // 7:32
        q5: "C", // 18 mg
        q6: "A", // 2.05 M
        q7: "D", // 1:1:1
        q8: "D", // CO₂ = 300 mL: CO = 400 mL
        q9: "C", // 500 K
        q10: "D", // 2.79 m
        q11: "A", // 100 mL of 0.2 N HCl
        q12: "B", // 4.96 g
        q13: "C", // 14 M
        q14: "B", // MCl₄
        q15: "A", // 0.57 M
        q16: "A", // 0.086
        q17: "D", // 5.71%, 42.86%
        q18: "B", // 0.24 g
        q19: "D", // 14.0%
        q20: "C", // Pr
        q21: "B", // 18.1 g
        q22: "B", // 44% C, 7% H
        q23: "D", // Temperatures below 0°C are possible in Celsius scale, but in Kelvin scale negative temperature is not possible
        q24: "A", // 40 mL
        q25: "A", // 960 g
        q26: "A", // CH₂O
        q27: "A", // CH₂O
        q28: "C", // C₄H₈
        q29: "A", // H₂
        q30: "B", // 2
        q31: "A", // 3.011 × 10²³
        q32: "A", // 1 g of H₂
        q33: "A", // 3 × 17 × Avogadro’s number
        q34: "A", // 90
        q35: "B", // A = B
        q36: "A", // 3
        q37: "B", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mn>1</mn><mn>8</mn></mfrac></mrow><annotation encoding="application/x-tex">\frac{1}{8}</annotation></semantics></math>
        q38: "D", // 1
        q39: "A", // 6
        q40: "B", // 45
        q41: "B", // 1
        q42: "B", // 12
        q43: "B", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi><mo>=</mo><msup><mi>y</mi><mfrac><mn>1</mn><mrow><mi>log</mi><mo>⁡</mo><mn>5</mn></mrow></mfrac></msup></mrow><annotation encoding="application/x-tex">x = y^{\frac{1}{\log 5}}</annotation></semantics></math>
        q44: "C", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mrow><mi>log</mi><mo>⁡</mo></mrow><mn>2</mn></msub><mn>11</mn></mrow><annotation encoding="application/x-tex">\log_2 11</annotation></semantics></math>
        q45: "B", // 1
        q46: "B", // 1
        q47: "C", // 8
        q48: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>2</mn><mo separator="true">,</mo><mi mathvariant="normal">∞</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(2, \infty)</annotation></semantics></math>
        q49: "D", // 4
        q50: "B", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mn>2</mn><mrow><mn>2</mn><mo>−</mo><msub><mrow><mi>log</mi><mo>⁡</mo></mrow><mn>2</mn></msub><mn>3</mn></mrow></mfrac></mrow><annotation encoding="application/x-tex">\frac{2}{2 - \log_2 3}</annotation></semantics></math>
        q51: "A", // 8
        q52: "B", // 9
        q53: "B", // 18
        q54: "B", // 13
        q55: "C", // 4
        q56: "B", // 3
        q57: "C", // 2
        q58: "B", // 1
        q59: "C", // 2
        q60: "C", // 2
        q61: "C", // 2
        q62: "A", // -6
        q63: "B", // 9
        q64: "C", // 2
        q65: "C", // 5
        q66: "B", // 2
        q67: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><msup><mi mathvariant="normal">L</mi><mn>2</mn></msup><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[\mathrm{L}^2]</annotation></semantics></math>
        q68: "B", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>T</mi><mn>2</mn></msub><mo>=</mo><mfrac><mi>n</mi><mi>m</mi></mfrac><msub><mi>T</mi><mn>1</mn></msub></mrow><annotation encoding="application/x-tex">T_2 = \frac{n}{m} T_1</annotation></semantics></math>
        q69: "B", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1.45</mn><mo>×</mo><mn>1</mn><msup><mn>0</mn><mn>9</mn></msup><mi mathvariant="normal">m</mi></mrow><annotation encoding="application/x-tex">1.45 \times 10^9 \mathrm{m}</annotation></semantics></math>
        q70: "A", // Ohm
        q71: "A", // 64
        q72: "C", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi mathvariant="normal">m</mi><mn>2</mn></msup><msup><mi mathvariant="normal">A</mi><mrow><mo>−</mo><mn>1</mn></mrow></msup><msup><mi mathvariant="normal">s</mi><mrow><mo>−</mo><mn>1</mn></mrow></msup></mrow><annotation encoding="application/x-tex">\mathrm{m^2 A^{-1} s^{-1}}</annotation></semantics></math>
        q73: "D", // All of the above
        q74: "A", // A-I, B-III, C-II, D-IV
        q75: "A", // A-III, B-I, C-II, D-IV
        q76: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mrow><mi mathvariant="normal">k</mi><mi mathvariant="normal">g</mi><mi mathvariant="normal">m</mi><msup><mi mathvariant="normal">s</mi><mrow><mo>−</mo><mn>2</mn></mrow></msup></mrow><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[\mathrm{kg m s^{-2}}]</annotation></semantics></math>
        q77: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mi mathvariant="normal">S</mi><mo stretchy="false">]</mo><mo>=</mo><mo stretchy="false">[</mo><mrow><mi mathvariant="normal">M</mi><msup><mi mathvariant="normal">T</mi><mrow><mo>−</mo><mn>2</mn></mrow></msup></mrow><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[\mathrm{S}] = [\mathrm{M T^{-2}}]</annotation></semantics></math>
        q78: "C", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mrow><mi mathvariant="normal">M</mi><msup><mi mathvariant="normal">L</mi><mrow><mo>−</mo><mn>1</mn></mrow></msup><msup><mi mathvariant="normal">T</mi><mrow><mo>−</mo><mn>2</mn></mrow></msup></mrow><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[\mathrm{M L^{-1} T^{-2}}]</annotation></semantics></math>
        q79: "B", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mrow><msup><mi mathvariant="normal">M</mi><mn>0</mn></msup><msup><mi mathvariant="normal">L</mi><mn>0</mn></msup><msup><mi mathvariant="normal">T</mi><mn>0</mn></msup></mrow><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[\mathrm{M^0 L^0 T^0}]</annotation></semantics></math>
        q80: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mrow><msup><mi mathvariant="normal">M</mi><mn>0</mn></msup><msup><mi mathvariant="normal">L</mi><mn>2</mn></msup><msup><mi mathvariant="normal">T</mi><mn>0</mn></msup></mrow><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[\mathrm{M^0 L^2 T^0}]</annotation></semantics></math>
        q81: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mi>P</mi><msup><mi>A</mi><mrow><mo>−</mo><mn>1</mn></mrow></msup><mi>T</mi><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[P A^{-1} T]</annotation></semantics></math>
        q82: "D", // Velocity gradient and decay constant
        q83: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mi>P</mi><mi>V</mi><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[P V]</annotation></semantics></math>
        q84: "D", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>L</mi><mi mathvariant="normal">/</mi><mi>C</mi></mrow><annotation encoding="application/x-tex">L/C</annotation></semantics></math>
        q85: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mrow><mi mathvariant="normal">M</mi><msup><mi mathvariant="normal">L</mi><mrow><mo>−</mo><mn>1</mn></mrow></msup><msup><mi mathvariant="normal">T</mi><mrow><mo>−</mo><mn>1</mn></mrow></msup></mrow><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[\mathrm{M L^{-1} T^{-1}}]</annotation></semantics></math>
        q86: "C", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mrow><msup><mi mathvariant="normal">M</mi><mn>0</mn></msup><msup><mi mathvariant="normal">L</mi><mrow><mo>−</mo><mn>1</mn></mrow></msup><msup><mi mathvariant="normal">T</mi><mn>0</mn></msup></mrow><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[\mathrm{M^0 L^{-1} T^0}]</annotation></semantics></math>
        q87: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mrow><mi mathvariant="normal">M</mi><msup><mi mathvariant="normal">L</mi><mn>2</mn></msup><msup><mi mathvariant="normal">T</mi><mrow><mo>−</mo><mn>2</mn></mrow></msup><msup><mi mathvariant="normal">A</mi><mrow><mo>−</mo><mn>2</mn></mrow></msup></mrow><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[\mathrm{M L^2 T^{-2} A^{-2}}]</annotation></semantics></math>
        q88: "D", // Dipole moment and electric flux
        q89: "C", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>J</mi><mo>=</mo><mi>ϵ</mi><mfrac><mrow><mi mathvariant="normal">∂</mi><mi>E</mi></mrow><mrow><mi mathvariant="normal">∂</mi><mi>t</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">J = \epsilon \frac{\partial E}{\partial t}</annotation></semantics></math>
        q90: "C", // Permeability of free space
        q91: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mrow><mi mathvariant="normal">F</mi><msup><mi mathvariant="normal">L</mi><mrow><mo>−</mo><mn>4</mn></mrow></msup><msup><mi mathvariant="normal">T</mi><mn>2</mn></msup></mrow><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[\mathrm{F L^{-4} T^2}]</annotation></semantics></math>
        q92: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mrow><msup><mi mathvariant="normal">M</mi><mn>0</mn></msup><msup><mi mathvariant="normal">L</mi><mn>0</mn></msup><msup><mi mathvariant="normal">T</mi><mn>0</mn></msup></mrow><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[\mathrm{M^0 L^0 T^0}]</annotation></semantics></math>
        q93: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mrow><msup><mi mathvariant="normal">M</mi><mn>0</mn></msup><mi mathvariant="normal">L</mi><msup><mi mathvariant="normal">T</mi><mrow><mo>−</mo><mn>1</mn></mrow></msup></mrow><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[\mathrm{M^0 L T^{-1}}]</annotation></semantics></math>
        q94: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mrow><msup><mi mathvariant="normal">M</mi><mn>0</mn></msup><msup><mi mathvariant="normal">L</mi><mn>0</mn></msup><msup><mi mathvariant="normal">T</mi><mn>0</mn></msup></mrow><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[\mathrm{M^0 L^0 T^0}]</annotation></semantics></math>
        q95: "B", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mrow><msup><mi mathvariant="normal">M</mi><mn>0</mn></msup><mi mathvariant="normal">L</mi><msup><mi mathvariant="normal">T</mi><mn>0</mn></msup></mrow><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[\mathrm{M^0 L T^0}]</annotation></semantics></math>
        q96: "A", // Same dimensions for <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi><mo separator="true">,</mo><mi>y</mi><mo separator="true">,</mo><mi>z</mi></mrow><annotation encoding="application/x-tex">x, y, z</annotation></semantics></math>
        q97: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mrow><mi mathvariant="normal">M</mi><mi mathvariant="normal">L</mi><msup><mi mathvariant="normal">T</mi><mrow><mo>−</mo><mn>3</mn></mrow></msup><msup><mi mathvariant="normal">K</mi><mrow><mo>−</mo><mn>1</mn></mrow></msup></mrow><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[\mathrm{M L T^{-3} K^{-1}}]</annotation></semantics></math>
        q98: "C", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mrow><mi mathvariant="normal">M</mi><msup><mi mathvariant="normal">L</mi><mn>0</mn></msup><msup><mi mathvariant="normal">T</mi><mrow><mo>−</mo><mn>3</mn></mrow></msup></mrow><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[\mathrm{M L^0 T^{-3}}]</annotation></semantics></math>
        q99: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mi>P</mi><msup><mi>A</mi><mrow><mn>1</mn><mi mathvariant="normal">/</mi><mn>2</mn></mrow></msup><msup><mi>T</mi><mrow><mo>−</mo><mn>1</mn></mrow></msup><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">[P A^{1/2} T^{-1}]</annotation></semantics></math>
        q100: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msqrt><mfrac><msub><mi>μ</mi><mn>0</mn></msub><msub><mi>ϵ</mi><mn>0</mn></msub></mfrac></msqrt></mrow><annotation encoding="application/x-tex">\sqrt{\frac{\mu_0}{\epsilon_0}}</annotation></semantics></math>
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
                <li id="flightmode-check">✗ Device must be in flight/airplane mode</li>
            </ul>
            <div id="password-section" style="display: none;">
                <p>Enter Quiz Password:</p>
                <input type="password" id="quiz-password" placeholder="Enter password">
                <p id="password-feedback" style="color: red; display: none;">Incorrect password!</p>
            </div>
            <button id="startQuizBtn" disabled>Start Quiz</button>
            <p id="flightmode-instruction">Please enable flight/airplane mode on your device, then click below to confirm</p>
            <button id="checkFlightModeBtn">I've Enabled Flight Mode</button>
        </div>
    `;

    // Insert prerequisite div before the container
    document.body.insertBefore(prerequisiteDiv, quizContainer);
    quizContainer.style.display = "none";
    document.querySelector(".heading").style.display = "none";

    // Check flight mode button
    document.getElementById("checkFlightModeBtn").addEventListener("click", checkFlightMode);

    // Start quiz button
    document.getElementById("startQuizBtn").addEventListener("click", function () {
        const passwordInput = document.getElementById("quiz-password");
        if (passwordInput.value === quizPassword) {
            prerequisiteDiv.style.display = "none";
            quizContainer.style.display = "flex";
            document.querySelector(".heading").style.display = "flex";
            quizStarted = true;
            updateTimer(); // Start the timer only when quiz starts
        } else {
            const passwordFeedback = document.getElementById("password-feedback");
            passwordFeedback.style.display = "block";
            passwordInput.value = "";
        }
    });

    // Network status detection
    window.addEventListener("online", checkQuizViolation);

    function checkFlightMode() {
        const isOffline = !navigator.onLine;
        const flightmodeCheck = document.getElementById("flightmode-check");

        if (isOffline) {
            flightmodeCheck.innerHTML = "✓ Device is in flight/airplane mode";
            flightmodeCheck.style.color = "green";

            // Show password section when flight mode is enabled
            document.getElementById("password-section").style.display = "block";
        } else {
            flightmodeCheck.innerHTML = "✗ Device must be in flight/airplane mode";
            flightmodeCheck.style.color = "red";
        }

        updateStartButton();
    }

    function updateStartButton() {
        const startBtn = document.getElementById("startQuizBtn");
        const passwordSection = document.getElementById("password-section");

        if (!navigator.onLine) {
            passwordSection.style.display = "block";
            startBtn.disabled = false;
        } else {
            passwordSection.style.display = "none";
            startBtn.disabled = true;
        }
    }

    function checkQuizViolation() {
        if (quizStarted) {
            if (navigator.onLine) {
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
        if (!resultDiv.style.display || resultDiv.style.display === "none") {
            prevBtn.style.display = index === 0 ? "none" : "inline-block";
            nextBtn.style.display = index === questions.length - 1 ? "none" : "inline-block";

            // Only show submit button on the last question
            if (index === questions.length - 1) {
                submitBtn.style.display = "block";
            } else {
                submitBtn.style.display = "none";
            }
        } else {
            // After quiz submission, always show navigation
            prevBtn.style.display = "inline-block";
            nextBtn.style.display = "inline-block";
            submitBtn.style.display = "none";
        }

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

        // Display simplified result
        const timeExpired = timeLeft <= 0;
        resultDiv.innerHTML = `
            <h2>Quiz Results</h2>
            <p>Your Score: ${score}/${totalQuestions}</p>
            <p>Questions Answered: ${answeredCount}/${totalQuestions}</p>
            ${timeExpired ? '<p>Time Expired!</p>' : ''}
            ${violation ? '<p>Quiz rules violated! Quiz auto-submitted.</p>' : ''}
            <p>You can now navigate through the questions to see the correct answers.</p>
        `;

        resultDiv.style.display = "block";

        // Disable all inputs but keep navigation enabled
        document.querySelectorAll("input[type=radio]").forEach(input => {
            input.disabled = true;
        });

        // Enable navigation buttons for review
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        submitBtn.disabled = true;

        // Show navigation buttons for review mode
        prevBtn.style.display = "inline-block";
        nextBtn.style.display = "inline-block";
        submitBtn.style.display = "none";

        // Update navigation button styles to show answer status
        updateNavigationButtonStyles();

        // Show correct answers in each question
        showCorrectAnswers();

        // End quiz state
        quizStarted = false;
    }

    // Show correct answers in each question
    function showCorrectAnswers() {
        questions.forEach((question, index) => {
            const questionKey = `q${index + 1}`;
            const correctAnswer = correctAnswers[questionKey];

            // Create or find the correct answer display element
            let answerDisplay = question.querySelector('.correct-answer-display');
            if (!answerDisplay) {
                answerDisplay = document.createElement('div');
                answerDisplay.className = 'correct-answer-display';
                answerDisplay.style.marginTop = '10px';
                answerDisplay.style.padding = '10px';
                answerDisplay.style.backgroundColor = '#e8f5e9';
                answerDisplay.style.border = '1px solid #4CAF50';
                answerDisplay.style.borderRadius = '5px';
                question.appendChild(answerDisplay);
            }

            // Show the correct answer
            answerDisplay.innerHTML = `<strong>Correct Answer:</strong> ${correctAnswer}`;

            // Highlight the correct and user-selected options
            const options = question.querySelectorAll('input[type="radio"]');
            options.forEach(option => {
                const optionLabel = option.parentElement;

                // Reset styles
                optionLabel.style.fontWeight = 'normal';

                // Highlight correct answer
                if (option.value === correctAnswer) {
                    optionLabel.style.color = '#4CAF50';
                    optionLabel.style.fontWeight = 'bold';
                }

                // Highlight user's incorrect answer if applicable
                const userAnswer = userAnswers[questionKey];
                if (userAnswer && userAnswer !== correctAnswer && option.value === userAnswer) {
                    optionLabel.style.color = '#f44336';
                    optionLabel.style.fontWeight = 'bold';
                }
            });
        });
    }

    // Update navigation button styles
    function updateNavigationButtonStyles() {
        document.querySelectorAll('.right.box .btn').forEach((btn, i) => {
            const qKey = `q${i + 1}`;
            btn.disabled = false;

            // Clear previous classes
            btn.classList.remove('answered', 'correct', 'incorrect', 'not-attempted');

            if (userAnswers[qKey]) {
                if (userAnswers[qKey] === correctAnswers[qKey]) {
                    btn.classList.add('correct');
                } else {
                    btn.classList.add('incorrect');
                }
            } else {
                btn.classList.add('not-attempted');
            }
        });

        // Add CSS for colored buttons
        const styleEl = document.createElement("style");
        styleEl.textContent = `
            .right.box .btn.correct {
                background-color: #4CAF50;
                color: white;
            }
            .right.box .btn.incorrect {
                background-color: #f44336;
                color: white;
            }
            .right.box .btn.not-attempted {
                background-color: #ff9800;
                color: white;
            }
            .right.box .btn.active {
                border: 3px solid #2196F3;
            }
        `;
        document.head.appendChild(styleEl);
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
