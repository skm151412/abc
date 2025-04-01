document.addEventListener("DOMContentLoaded", function () {
    // Setup variables
    const questions = document.querySelectorAll(".question");
    const totalQuestions = questions.length;
    let currentQuestionIndex = 0;
    let userAnswers = {};

    // Timer setup - 30 minutes
    let timeLeft = 3*60*60;
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
        q4: "D", // All of these
        q5: "B", // [ML⁻¹T⁻²]
        q6: "D", // Watt
        q7: "B", // Watt
        q8: "B", // [LT⁻²]
        q9: "C", // Work and energy
        q10: "B", // Momentum
        q11: "B", // [ML²T⁻¹]
        q12: "B", // Pressure
        q13: "A", // [ML⁻¹T⁻¹]
        q14: "C", // FV⁻²T
        q15: "D", // Power
        q16: "C", // C²m⁻²N⁻¹
        q17: "A", // [LT⁻³]
        q18: "A", // kg⋅m⁻¹s⁻¹
        q19: "D", // Ev⁻²
        q20: "A", // 1
        q21: "A", // Dimensionless constant
        q22: "B", // Work and torque
        q23: "A", // [M⁻¹L³T⁻²]
        q24: "D", // Density
        q25: "A", // [ML⁻¹T⁻²]
        q26: "C", // kg⋅m/s
        q27: "A", // Work
        q28: "C", // [M¹L⁰T⁻⁴]
        q29: "A", // [ML²T⁻¹A⁻¹]
        q30: "A", // Strain
        q31: "A", // N/m²
        q32: "B", // [ML²T⁻²]
        q33: "A", // [MLT⁻³K⁻¹]
        q34: "C", // [ML²]
        q35: "B", // Ohm
        q36: "D", // Momentum
        q37: "C", // Steradian
        q38: "A", // rad/s
        q39: "A", // [ML²T⁻²K⁻¹]
        q40: "D", // Work per unit volume
        q41: "B", // [ML²T⁻²A⁻¹]
        q42: "C", // Momentum
        q43: "A", // J/kg
        q44: "B", // Work
        q45: "A", // [MLT⁻³A⁻¹]
        q46: "B", // FV⁻²T
        q47: "B", // [ML³T⁻³A⁻²]
        q48: "A", // J/s
        q49: "D", // None of these
        q50: "C", // kg⋅m²/s
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
        q72: "A", // kg⋅m²
        q73: "D", // Watt
        q74: "B", // N/m²
        q75: "B", // J/m³
        q76: "A", // [ML²T⁻²K⁻¹]
        q77: "D", // Kelvin
        q78: "A", // Ns/m²
        q79: "C", // Work
        q80: "B", // C⋅m
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
        q100: "B", // Henry per meterRetryClaude can make mistakes. Please double-check responses.
    };

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
    function submitQuiz() {
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
        `;
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

    submitBtn.addEventListener("click", submitQuiz);

    // Initialize the quiz
    showQuestion(0);
    updateTimer();
});