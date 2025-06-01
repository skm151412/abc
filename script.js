document.addEventListener("DOMContentLoaded", function () {
    // Setup variables
    const questions = document.querySelectorAll(".question");
    const totalQuestions = questions.length;
    let currentQuestionIndex = 0;
    let userAnswers = {};
    let quizStarted = false;
    const quizPassword = "web456"; // Default password for the quiz
    const authorPassword = "dev123"; // New password for the author to show answers

    // Timer setup - 30 minutes
    let timeLeft = 1.5 * 60 * 60;  // 3 hours in seconds
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
         q1: "C", // Solve <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>A</mi><mo>=</mo><mo stretchy="false">{</mo><mi>x</mi><mo>∣</mo><msup><mi>x</mi><mn>2</mn></msup><mo>−</mo><mn>5</mn><mi>x</mi><mo>+</mo><mn>6</mn><mo>=</mo><mn>0</mn><mo stretchy="false">}</mo><mo>⇒</mo><mi>x</mi><mo>=</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn></mrow><annotation encoding="application/x-tex"> A = \{x \mid x^2 - 5x + 6 = 0\} \Rightarrow x = 2, 3 </annotation></semantics></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>B</mi><mo>=</mo><mo stretchy="false">{</mo><mi>x</mi><mo>∣</mo><msup><mi>x</mi><mn>2</mn></msup><mo>−</mo><mn>7</mn><mi>x</mi><mo>+</mo><mn>12</mn><mo>=</mo><mn>0</mn><mo stretchy="false">}</mo><mo>⇒</mo><mi>x</mi><mo>=</mo><mn>3</mn><mo separator="true">,</mo><mn>4</mn></mrow><annotation encoding="application/x-tex"> B = \{x \mid x^2 - 7x + 12 = 0\} \Rightarrow x = 3, 4 </annotation></semantics></math>. Thus, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>A</mi><mo>∪</mo><mi>B</mi><mo>=</mo><mo stretchy="false">{</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo separator="true">,</mo><mn>4</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex"> A \cup B = \{2, 3, 4\} </annotation></semantics></math>, so 3 elements.
        q2: "D", // Let <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo><msup><mi>x</mi><mn>2</mn></msup><mo>−</mo><mn>4</mn><mi>x</mi><mo>+</mo><mn>3</mn></mrow><annotation encoding="application/x-tex"> f(x) = x^2 - 4x + 3 </annotation></semantics></math>. Then <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>f</mi><mo stretchy="false">(</mo><mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo stretchy="false">)</mo><mo>=</mo><mo stretchy="false">(</mo><msup><mi>x</mi><mn>2</mn></msup><mo>−</mo><mn>4</mn><mi>x</mi><mo>+</mo><mn>3</mn><msup><mo stretchy="false">)</mo><mn>2</mn></msup><mo>−</mo><mn>4</mn><mo stretchy="false">(</mo><msup><mi>x</mi><mn>2</mn></msup><mo>−</mo><mn>4</mn><mi>x</mi><mo>+</mo><mn>3</mn><mo stretchy="false">)</mo><mo>+</mo><mn>3</mn><mo>=</mo><mn>0</mn></mrow><annotation encoding="application/x-tex"> f(f(x)) = (x^2 - 4x + 3)^2 - 4(x^2 - 4x + 3) + 3 = 0 </annotation></semantics></math>. Substitute <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>y</mi><mo>=</mo><msup><mi>x</mi><mn>2</mn></msup><mo>−</mo><mn>4</mn><mi>x</mi><mo>+</mo><mn>3</mn></mrow><annotation encoding="application/x-tex"> y = x^2 - 4x + 3 </annotation></semantics></math>, so <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>y</mi><mn>2</mn></msup><mo>−</mo><mn>4</mn><mi>y</mi><mo>+</mo><mn>3</mn><mo>=</mo><mn>0</mn><mo>⇒</mo><mi>y</mi><mo>=</mo><mn>1</mn><mo separator="true">,</mo><mn>3</mn></mrow><annotation encoding="application/x-tex"> y^2 - 4y + 3 = 0 \Rightarrow y = 1, 3 </annotation></semantics></math>. Solve <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>x</mi><mn>2</mn></msup><mo>−</mo><mn>4</mn><mi>x</mi><mo>+</mo><mn>3</mn><mo>=</mo><mn>1</mn><mo>⇒</mo><mi>x</mi><mo>=</mo><mn>1</mn><mo separator="true">,</mo><mn>3</mn></mrow><annotation encoding="application/x-tex"> x^2 - 4x + 3 = 1 \Rightarrow x = 1, 3 </annotation></semantics></math>; <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>x</mi><mn>2</mn></msup><mo>−</mo><mn>4</mn><mi>x</mi><mo>+</mo><mn>3</mn><mo>=</mo><mn>3</mn><mo>⇒</mo><mi>x</mi><mo>=</mo><mn>0</mn><mo separator="true">,</mo><mn>4</mn></mrow><annotation encoding="application/x-tex"> x^2 - 4x + 3 = 3 \Rightarrow x = 0, 4 </annotation></semantics></math>. Four distinct roots.
        q3: "D", 
        q4: "B", // For <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>z</mi><mo>=</mo><mn>1</mn><mo>+</mo><mi>i</mi></mrow><annotation encoding="application/x-tex"> z = 1 + i </annotation></semantics></math>, modulus <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi mathvariant="normal">∣</mi><mi>z</mi><mi mathvariant="normal">∣</mi><mo>=</mo><msqrt><mn>2</mn></msqrt></mrow><annotation encoding="application/x-tex"> |z| = \sqrt{2} </annotation></semantics></math>, argument <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>θ</mi><mo>=</mo><mfrac><mi>π</mi><mn>4</mn></mfrac></mrow><annotation encoding="application/x-tex"> \theta = \frac{\pi}{4} </annotation></semantics></math>. Then <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>z</mi><mn>2025</mn></msup><mo>=</mo><mo stretchy="false">(</mo><msqrt><mn>2</mn></msqrt><msup><mo stretchy="false">)</mo><mn>2025</mn></msup><msup><mi>e</mi><mrow><mi>i</mi><mo>⋅</mo><mn>2025</mn><mo>⋅</mo><mfrac><mi>π</mi><mn>4</mn></mfrac></mrow></msup></mrow><annotation encoding="application/x-tex"> z^{2025} = (\sqrt{2})^{2025} e^{i \cdot 2025 \cdot \frac{\pi}{4}} </annotation></semantics></math>. Since <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>2025</mn><mo>⋅</mo><mfrac><mi>π</mi><mn>4</mn></mfrac><mo>=</mo><mn>506.25</mn><mi>π</mi><mo>=</mo><mn>506</mn><mi>π</mi><mo>+</mo><mfrac><mi>π</mi><mn>2</mn></mfrac></mrow><annotation encoding="application/x-tex"> 2025 \cdot \frac{\pi}{4} = 506.25\pi = 506\pi + \frac{\pi}{2} </annotation></semantics></math>, the argument is <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mi>π</mi><mn>2</mn></mfrac><mspace></mspace><mspace width="0.6667em"></mspace><mrow><mi mathvariant="normal">m</mi><mi mathvariant="normal">o</mi><mi mathvariant="normal">d</mi></mrow><mtext> </mtext><mtext> </mtext><mn>2</mn><mi>π</mi></mrow><annotation encoding="application/x-tex"> \frac{\pi}{2} \mod 2\pi </annotation></semantics></math>, placing <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>z</mi><mn>2025</mn></msup></mrow><annotation encoding="application/x-tex"> z^{2025} </annotation></semantics></math> in the second quadrant.
        q5: "C", // Solve <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>x</mi><mn>4</mn></msup><mo>−</mo><mn>4</mn><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><mn>4</mn><mo>=</mo><mo stretchy="false">(</mo><msup><mi>x</mi><mn>2</mn></msup><mo>−</mo><mn>2</mn><msup><mo stretchy="false">)</mo><mn>2</mn></msup><mo>=</mo><mn>0</mn></mrow><annotation encoding="application/x-tex"> x^4 - 4x^2 + 4 = (x^2 - 2)^2 = 0 </annotation></semantics></math>. Roots are <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>x</mi><mn>2</mn></msup><mo>=</mo><mn>2</mn><mo>⇒</mo><mi>x</mi><mo>=</mo><mo>±</mo><msqrt><mn>2</mn></msqrt></mrow><annotation encoding="application/x-tex"> x^2 = 2 \Rightarrow x = \pm \sqrt{2} </annotation></semantics></math>. Two real roots.
        q6: "A", // Sum of cubes: <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msubsup><mo>∑</mo><mrow><mi>k</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></msubsup><msup><mi>k</mi><mn>3</mn></msup><mo>=</mo><msup><mrow><mo fence="true">(</mo><mfrac><mrow><mi>n</mi><mo stretchy="false">(</mo><mi>n</mi><mo>+</mo><mn>1</mn><mo stretchy="false">)</mo></mrow><mn>2</mn></mfrac><mo fence="true">)</mo></mrow><mn>2</mn></msup></mrow><annotation encoding="application/x-tex"> \sum_{k=1}^n k^3 = \left(\frac{n(n+1)}{2}\right)^2 </annotation></semantics></math>. For <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>n</mi><mo>=</mo><mn>10</mn></mrow><annotation encoding="application/x-tex"> n = 10 </annotation></semantics></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mrow><mn>10</mn><mo>⋅</mo><mn>11</mn></mrow><mn>2</mn></mfrac><mo>=</mo><mn>55</mn></mrow><annotation encoding="application/x-tex"> \frac{10 \cdot 11}{2} = 55 </annotation></semantics></math>, so <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>5</mn><msup><mn>5</mn><mn>2</mn></msup><mo>=</mo><mn>3025</mn></mrow><annotation encoding="application/x-tex"> 55^2 = 3025 </annotation></semantics></math>.
        q7: "A", 
        q8: "D", // For <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi mathvariant="normal">∣</mi><mi>x</mi><mo>−</mo><mn>1</mn><mi mathvariant="normal">∣</mi><mo>+</mo><mi mathvariant="normal">∣</mi><mi>x</mi><mo>−</mo><mn>2</mn><mi mathvariant="normal">∣</mi><mo>≤</mo><mn>1</mn></mrow><annotation encoding="application/x-tex"> |x - 1| + |x - 2| \leq 1 </annotation></semantics></math>, consider critical points <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi><mo>=</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn></mrow><annotation encoding="application/x-tex"> x = 1, 2 </annotation></semantics></math>. At <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi><mo>=</mo><mn>1.5</mn></mrow><annotation encoding="application/x-tex"> x = 1.5 </annotation></semantics></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi mathvariant="normal">∣</mi><mn>1.5</mn><mo>−</mo><mn>1</mn><mi mathvariant="normal">∣</mi><mo>+</mo><mi mathvariant="normal">∣</mi><mn>1.5</mn><mo>−</mo><mn>2</mn><mi mathvariant="normal">∣</mi><mo>=</mo><mn>0.5</mn><mo>+</mo><mn>0.5</mn><mo>=</mo><mn>1</mn></mrow><annotation encoding="application/x-tex"> |1.5 - 1| + |1.5 - 2| = 0.5 + 0.5 = 1 </annotation></semantics></math>. The sum is <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>≥</mo><mn>1</mn></mrow><annotation encoding="application/x-tex"> \geq 1 </annotation></semantics></math> elsewhere, so no real solutions satisfy <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>≤</mo><mn>1</mn></mrow><annotation encoding="application/x-tex"> \leq 1 </annotation></semantics></math>.
        q9: "A", 
        q10: "B", // Let <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mo>=</mo><mn>2</mn><mo>+</mo><msqrt><mn>3</mn></msqrt></mrow><annotation encoding="application/x-tex"> a = 2 + \sqrt{3} </annotation></semantics></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>b</mi><mo>=</mo><mn>2</mn><mo>−</mo><msqrt><mn>3</mn></msqrt></mrow><annotation encoding="application/x-tex"> b = 2 - \sqrt{3} </annotation></semantics></math>. Then <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mi>b</mi><mo>=</mo><mn>1</mn></mrow><annotation encoding="application/x-tex"> ab = 1 </annotation></semantics></math>, so <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>a</mi><mi>n</mi></msup><mo>+</mo><msup><mi>b</mi><mi>n</mi></msup></mrow><annotation encoding="application/x-tex"> a^n + b^n </annotation></semantics></math> is an integer. For large <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>n</mi><mo>=</mo><mn>2025</mn></mrow><annotation encoding="application/x-tex"> n = 2025 </annotation></semantics></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>b</mi><mn>2025</mn></msup><mo>≈</mo><mn>0</mn></mrow><annotation encoding="application/x-tex"> b^{2025} \approx 0 </annotation></semantics></math>, so <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mrow><msup><mi>a</mi><mn>2025</mn></msup><mo>+</mo><msup><mi>b</mi><mn>2025</mn></msup></mrow><msup><mn>2</mn><mn>2025</mn></msup></mfrac><mo>≈</mo><mfrac><msup><mi>a</mi><mn>2025</mn></msup><msup><mn>2</mn><mn>2025</mn></msup></mfrac><mo>=</mo><msup><mrow><mo fence="true">(</mo><mfrac><mrow><mn>2</mn><mo>+</mo><msqrt><mn>3</mn></msqrt></mrow><mn>2</mn></mfrac><mo fence="true">)</mo></mrow><mn>2025</mn></msup><mo>≈</mo><mn>2</mn></mrow><annotation encoding="application/x-tex"> \frac{a^{2025} + b^{2025}}{2^{2025}} \approx \frac{a^{2025}}{2^{2025}} = \left(\frac{2 + \sqrt{3}}{2}\right)^{2025} \approx 2 </annotation></semantics></math>.
        q11: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>sin</mi><mo>⁡</mo><mi>x</mi><mo>+</mo><mi>cos</mi><mo>⁡</mo><mi>x</mi><mo>=</mo><msqrt><mn>2</mn></msqrt><mi>sin</mi><mo>⁡</mo><mo stretchy="false">(</mo><mi>x</mi><mo>+</mo><mfrac><mi>π</mi><mn>4</mn></mfrac><mo stretchy="false">)</mo><mo>≤</mo><msqrt><mn>2</mn></msqrt><mo>&#x3C;</mo><mn>2</mn></mrow><annotation encoding="application/x-tex"> \sin x + \cos x = \sqrt{2} \sin(x + \frac{\pi}{4}) \leq \sqrt{2} &#x3C; 2 </annotation></semantics></math>, so no solutions. The Reason (<math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>max</mi><mo>⁡</mo><mo stretchy="false">(</mo><mi>sin</mi><mo>⁡</mo><mi>x</mi><mo>+</mo><mi>cos</mi><mo>⁡</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo><msqrt><mn>2</mn></msqrt></mrow><annotation encoding="application/x-tex"> \max(\sin x + \cos x) = \sqrt{2} </annotation></semantics></math>) explains the Assertion.
        q12: "C", // Using <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>a</mi><mo>+</mo><mi>b</mi><msup><mo stretchy="false">)</mo><mn>3</mn></msup><mo>=</mo><msup><mi>a</mi><mn>3</mn></msup><mo>+</mo><msup><mi>b</mi><mn>3</mn></msup><mo>+</mo><mn>3</mn><mi>a</mi><mi>b</mi><mo stretchy="false">(</mo><mi>a</mi><mo>+</mo><mi>b</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex"> (a + b)^3 = a^3 + b^3 + 3ab(a + b) </annotation></semantics></math>, for <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mo>=</mo><msqrt><mn>2</mn></msqrt></mrow><annotation encoding="application/x-tex"> a = \sqrt{2} </annotation></semantics></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>b</mi><mo>=</mo><msqrt><mn>3</mn></msqrt></mrow><annotation encoding="application/x-tex"> b = \sqrt{3} </annotation></semantics></math>: <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><msqrt><mn>2</mn></msqrt><mo>+</mo><msqrt><mn>3</mn></msqrt><msup><mo stretchy="false">)</mo><mn>3</mn></msup><mo>=</mo><mn>2</mn><msqrt><mn>2</mn></msqrt><mo>+</mo><mn>3</mn><msqrt><mn>3</mn></msqrt><mo>+</mo><mn>3</mn><mo>⋅</mo><msqrt><mn>2</mn></msqrt><mo>⋅</mo><msqrt><mn>3</mn></msqrt><mo stretchy="false">(</mo><msqrt><mn>2</mn></msqrt><mo>+</mo><msqrt><mn>3</mn></msqrt><mo stretchy="false">)</mo><mo>=</mo><mn>2</mn><msqrt><mn>2</mn></msqrt><mo>+</mo><mn>3</mn><msqrt><mn>3</mn></msqrt><mo>+</mo><mn>3</mn><msqrt><mn>6</mn></msqrt><mo stretchy="false">(</mo><msqrt><mn>2</mn></msqrt><mo>+</mo><msqrt><mn>3</mn></msqrt><mo stretchy="false">)</mo><mo>=</mo><mn>11</mn><mo>+</mo><mn>6</mn><msqrt><mn>6</mn></msqrt></mrow><annotation encoding="application/x-tex"> (\sqrt{2} + \sqrt{3})^3 = 2\sqrt{2} + 3\sqrt{3} + 3 \cdot \sqrt{2} \cdot \sqrt{3} (\sqrt{2} + \sqrt{3}) = 2\sqrt{2} + 3\sqrt{3} + 3\sqrt{6} (\sqrt{2} + \sqrt{3}) = 11 + 6\sqrt{6} </annotation></semantics></math>.
        q13: "B", // Solve <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><msup><mi>y</mi><mn>2</mn></msup><mo>=</mo><mn>25</mn></mrow><annotation encoding="application/x-tex"> x^2 + y^2 = 25 </annotation></semantics></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi><mo separator="true">,</mo><mi>y</mi><mo>∈</mo><mo stretchy="false">{</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo separator="true">,</mo><mn>4</mn><mo separator="true">,</mo><mn>5</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex"> x, y \in \{1, 2, 3, 4, 5\} </annotation></semantics></math>. Check pairs: <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>3</mn><mo separator="true">,</mo><mn>4</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex"> (3, 4) </annotation></semantics></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>4</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex"> (4, 3) </annotation></semantics></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mo>−</mo><mn>3</mn><mo separator="true">,</mo><mn>4</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex"> (-3, 4) </annotation></semantics></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mo>−</mo><mn>4</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex"> (-4, 3) </annotation></semantics></math>. Four valid pairs.
        q14: "A", // For <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>z</mi><mo>=</mo><mi>cos</mi><mo>⁡</mo><mi>θ</mi><mo>+</mo><mi>i</mi><mi>sin</mi><mo>⁡</mo><mi>θ</mi></mrow><annotation encoding="application/x-tex"> z = \cos \theta + i \sin \theta </annotation></semantics></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>z</mi><mi>n</mi></msup><mo>=</mo><mi>cos</mi><mo>⁡</mo><mi>n</mi><mi>θ</mi><mo>+</mo><mi>i</mi><mi>sin</mi><mo>⁡</mo><mi>n</mi><mi>θ</mi></mrow><annotation encoding="application/x-tex"> z^n = \cos n\theta + i \sin n\theta </annotation></semantics></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>z</mi><mrow><mo>−</mo><mi>n</mi></mrow></msup><mo>=</mo><mi>cos</mi><mo>⁡</mo><mi>n</mi><mi>θ</mi><mo>−</mo><mi>i</mi><mi>sin</mi><mo>⁡</mo><mi>n</mi><mi>θ</mi></mrow><annotation encoding="application/x-tex"> z^{-n} = \cos n\theta - i \sin n\theta </annotation></semantics></math>. Thus, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mrow><msup><mi>z</mi><mn>2025</mn></msup><mo>−</mo><msup><mi>z</mi><mrow><mo>−</mo><mn>2025</mn></mrow></msup></mrow><mrow><mn>2</mn><mi>i</mi></mrow></mfrac><mo>=</mo><mfrac><mrow><mn>2</mn><mi>i</mi><mi>sin</mi><mo>⁡</mo><mn>2025</mn><mi>θ</mi></mrow><mrow><mn>2</mn><mi>i</mi></mrow></mfrac><mo>=</mo><mi>sin</mi><mo>⁡</mo><mn>2025</mn><mi>θ</mi></mrow><annotation encoding="application/x-tex"> \frac{z^{2025} - z^{-2025}}{2i} = \frac{2i \sin 2025\theta}{2i} = \sin 2025\theta </annotation></semantics></math>.
        q15: "B", // Decompose <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mn>1</mn><mrow><msup><mi>n</mi><mn>2</mn></msup><mo>+</mo><mn>3</mn><mi>n</mi><mo>+</mo><mn>2</mn></mrow></mfrac><mo>=</mo><mfrac><mn>1</mn><mrow><mo stretchy="false">(</mo><mi>n</mi><mo>+</mo><mn>1</mn><mo stretchy="false">)</mo><mo stretchy="false">(</mo><mi>n</mi><mo>+</mo><mn>2</mn><mo stretchy="false">)</mo></mrow></mfrac><mo>=</mo><mfrac><mn>1</mn><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow></mfrac><mo>−</mo><mfrac><mn>1</mn><mrow><mi>n</mi><mo>+</mo><mn>2</mn></mrow></mfrac></mrow><annotation encoding="application/x-tex"> \frac{1}{n^2 + 3n + 2} = \frac{1}{(n+1)(n+2)} = \frac{1}{n+1} - \frac{1}{n+2} </annotation></semantics></math>. The series telescopes to <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1</mn><mo>−</mo><mfrac><mn>1</mn><mrow><mi>n</mi><mo>+</mo><mn>2</mn></mrow></mfrac></mrow><annotation encoding="application/x-tex"> 1 - \frac{1}{n+2} </annotation></semantics></math>, and as <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>n</mi><mo>→</mo><mi mathvariant="normal">∞</mi></mrow><annotation encoding="application/x-tex"> n \to \infty </annotation></semantics></math>, the sum is 1.
        q16: "A", // For <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>x</mi><mn>2</mn></msup><mo>−</mo><mn>4</mn><mi>x</mi><mo>+</mo><mn>4</mn><mo>=</mo><mo stretchy="false">(</mo><mi>x</mi><mo>−</mo><mn>2</mn><msup><mo stretchy="false">)</mo><mn>2</mn></msup><mo>=</mo><mn>0</mn></mrow><annotation encoding="application/x-tex"> x^2 - 4x + 4 = (x - 2)^2 = 0 </annotation></semantics></math>, discriminant <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>−</mo><mn>4</mn><mi>a</mi><mi>c</mi><mo>=</mo><mn>16</mn><mo>−</mo><mn>16</mn><mo>=</mo><mn>0</mn></mrow><annotation encoding="application/x-tex"> b^2 - 4ac = 16 - 16 = 0 </annotation></semantics></math>, so equal roots. The Reason explains the Assertion.
        q17: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mrow><msup><mn>2</mn><mn>2025</mn></msup><mo>⋅</mo><msup><mn>3</mn><mn>1012</mn></msup></mrow><msup><mn>6</mn><mn>1013</mn></msup></mfrac><mo>=</mo><mfrac><mrow><msup><mn>2</mn><mn>2025</mn></msup><mo>⋅</mo><msup><mn>3</mn><mn>1012</mn></msup></mrow><mrow><mo stretchy="false">(</mo><mn>2</mn><mo>⋅</mo><mn>3</mn><msup><mo stretchy="false">)</mo><mn>1013</mn></msup></mrow></mfrac><mo>=</mo><mfrac><msup><mn>2</mn><mn>2025</mn></msup><msup><mn>2</mn><mn>1013</mn></msup></mfrac><mo>⋅</mo><mfrac><msup><mn>3</mn><mn>1012</mn></msup><msup><mn>3</mn><mn>1013</mn></msup></mfrac><mo>=</mo><msup><mn>2</mn><mrow><mn>2025</mn><mo>−</mo><mn>1013</mn></mrow></msup><mo>⋅</mo><msup><mn>3</mn><mrow><mo>−</mo><mn>1</mn></mrow></msup><mo>=</mo><msup><mn>2</mn><mn>1012</mn></msup><mo>⋅</mo><mfrac><mn>1</mn><mn>3</mn></mfrac></mrow><annotation encoding="application/x-tex"> \frac{2^{2025} \cdot 3^{1012}}{6^{1013}} = \frac{2^{2025} \cdot 3^{1012}}{(2 \cdot 3)^{1013}} = \frac{2^{2025}}{2^{1013}} \cdot \frac{3^{1012}}{3^{1013}} = 2^{2025 - 1013} \cdot 3^{-1} = 2^{1012} \cdot \frac{1}{3} </annotation></semantics></math>. Correct answer should be adjusted; correct form yields <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mn>2</mn><mn>1012</mn></msup></mrow><annotation encoding="application/x-tex"> 2^{1012} </annotation></semantics></math>.
        q18: "A", // <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>sin</mi><mo>⁡</mo><mi>x</mi><mo>+</mo><mi>cos</mi><mo>⁡</mo><mi>x</mi><mo>=</mo><msqrt><mn>2</mn></msqrt><mi>sin</mi><mo>⁡</mo><mo stretchy="false">(</mo><mi>x</mi><mo>+</mo><mfrac><mi>π</mi><mn>4</mn></mfrac><mo stretchy="false">)</mo><mo>≤</mo><msqrt><mn>2</mn></msqrt><mo>&#x3C;</mo><mfrac><mn>3</mn><mn>2</mn></mfrac></mrow><annotation encoding="application/x-tex"> \sin x + \cos x = \sqrt{2} \sin(x + \frac{\pi}{4}) \leq \sqrt{2} &#x3C; \frac{3}{2} </annotation></semantics></math>, so no solutions in <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">[</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mi>π</mi><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex"> [0, 2\pi] </annotation></semantics></math>.
        q19: "A", // For <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>x</mi><mn>2</mn></msup><mo>−</mo><mi>p</mi><mi>x</mi><mo>+</mo><mi>q</mi><mo>=</mo><mn>0</mn></mrow><annotation encoding="application/x-tex"> x^2 - px + q = 0 </annotation></semantics></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>α</mi><mo>+</mo><mi>β</mi><mo>=</mo><mi>p</mi><mo>=</mo><mn>5</mn></mrow><annotation encoding="application/x-tex"> \alpha + \beta = p = 5 </annotation></semantics></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>α</mi><mn>2</mn></msup><mo>+</mo><msup><mi>β</mi><mn>2</mn></msup><mo>=</mo><mo stretchy="false">(</mo><mi>α</mi><mo>+</mo><mi>β</mi><msup><mo stretchy="false">)</mo><mn>2</mn></msup><mo>−</mo><mn>2</mn><mi>α</mi><mi>β</mi><mo>=</mo><mn>25</mn><mo>−</mo><mn>2</mn><mi>q</mi><mo>=</mo><mn>13</mn><mo>⇒</mo><mn>2</mn><mi>q</mi><mo>=</mo><mn>12</mn><mo>⇒</mo><mi>q</mi><mo>=</mo><mn>6</mn></mrow><annotation encoding="application/x-tex"> \alpha^2 + \beta^2 = (\alpha + \beta)^2 - 2\alpha\beta = 25 - 2q = 13 \Rightarrow 2q = 12 \Rightarrow q = 6 </annotation></semantics></math>.
        q20: "B", // In <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>1</mn><mo>+</mo><mi>x</mi><mo>+</mo><msup><mi>x</mi><mn>2</mn></msup><msup><mo stretchy="false">)</mo><mn>15</mn></msup></mrow><annotation encoding="application/x-tex"> (1 + x + x^2)^{15} </annotation></semantics></math>, find terms with <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>x</mi><mn>5</mn></msup></mrow><annotation encoding="application/x-tex"> x^5 </annotation></semantics></math>. Use generating function: coefficient of <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>x</mi><mn>5</mn></msup></mrow><annotation encoding="application/x-tex"> x^5 </annotation></semantics></math> is the number of ways to choose <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>k</mi><mn>0</mn></msub><mo>+</mo><msub><mi>k</mi><mn>1</mn></msub><mo>+</mo><msub><mi>k</mi><mn>2</mn></msub><mo>=</mo><mn>15</mn></mrow><annotation encoding="application/x-tex"> k_0 + k_1 + k_2 = 15 </annotation></semantics></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>k</mi><mn>1</mn></msub><mo>+</mo><mn>2</mn><msub><mi>k</mi><mn>2</mn></msub><mo>=</mo><mn>5</mn></mrow><annotation encoding="application/x-tex"> k_1 + 2k_2 = 5 </annotation></semantics></math>. Solving, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>k</mi><mn>1</mn></msub><mo>=</mo><mn>5</mn><mo>−</mo><mn>2</mn><msub><mi>k</mi><mn>2</mn></msub></mrow><annotation encoding="application/x-tex"> k_1 = 5 - 2k_2 </annotation></semantics></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>k</mi><mn>0</mn></msub><mo>=</mo><mn>10</mn><mo>+</mo><msub><mi>k</mi><mn>2</mn></msub></mrow><annotation encoding="application/x-tex"> k_0 = 10 + k_2 </annotation></semantics></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>k</mi><mn>2</mn></msub><mo>=</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn></mrow><annotation encoding="application/x-tex"> k_2 = 0, 1, 2 </annotation></semantics></math>. Valid <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>k</mi><mn>2</mn></msub><mo>=</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn></mrow><annotation encoding="application/x-tex"> k_2 = 0, 1 </annotation></semantics></math>, giving 16 terms.
        q21: "A",
        q22: "D",
        q23: "B",
        q24: "B",
        q25: "A",
        q26: "A",
        q27: "A",
        q28: "B",
        q29: "B",
        q30: "A",
        q31: "A",
        q32: "B",
        q33: "B",
        q34: "A",
        q35: "A",
        q36: "A",
        q37: "A",
        q38: "A",
        q39: "A",
        q40: "A",
        q41: "B",
        q42: "A",
        q43: "A",
        q44: "A",
        q45: "B",
        q46: "D",
        q47: "B",
        q48: "A",
        q49: "B",
        q50: "C",
    };

    // Show answers control flag
    let showAnswersEnabled = false;

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
            <div id="author-controls" style="margin-top: 20px; padding: 10px; border: 1px dashed #ccc; background-color: #f9f9f9;">
                <p><strong>Author Controls:</strong></p>
                <input type="password" id="author-password" placeholder="Author Password">
                <button id="toggle-answers-btn">Show Answers</button>
                <p id="author-feedback" style="color: red; display: none;">Incorrect author password!</p>
            </div>
        `;

        resultDiv.style.display = "block";

        // Set up the toggle answers button
        document.getElementById("toggle-answers-btn").addEventListener("click", function() {
            const authorPasswordInput = document.getElementById("author-password");
            const authorFeedback = document.getElementById("author-feedback");
            
            if (authorPasswordInput.value === authorPassword) {
                showAnswersEnabled = !showAnswersEnabled;
                this.textContent = showAnswersEnabled ? "Hide Answers" : "Show Answers";
                authorFeedback.style.display = "none";
                
                if (showAnswersEnabled) {
                    showCorrectAnswers();
                } else {
                    hideCorrectAnswers();
                }
                
                // Update navigation button styles
                updateNavigationButtonStyles();
            } else {
                authorFeedback.style.display = "block";
                authorPasswordInput.value = "";
            }
        });

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

        // Only show correct answers if enabled
        if (showAnswersEnabled) {
            showCorrectAnswers();
        }

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
            answerDisplay.style.display = 'block';

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

    // Hide correct answers
    function hideCorrectAnswers() {
        questions.forEach((question) => {
            // Hide correct answer display
            const answerDisplay = question.querySelector('.correct-answer-display');
            if (answerDisplay) {
                answerDisplay.style.display = 'none';
            }

            // Reset option styles
            const options = question.querySelectorAll('input[type="radio"]');
            options.forEach(option => {
                const optionLabel = option.parentElement;
                optionLabel.style.color = '';
                optionLabel.style.fontWeight = 'normal';
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

            // If answers are enabled, show correct/incorrect status
            if (showAnswersEnabled) {
                if (userAnswers[qKey]) {
                    if (userAnswers[qKey] === correctAnswers[qKey]) {
                        btn.classList.add('correct');
                    } else {
                        btn.classList.add('incorrect');
                    }
                } else {
                    btn.classList.add('not-attempted');
                }
            } else {
                // If answers are disabled, just show which ones were answered
                if (userAnswers[qKey]) {
                    btn.classList.add('answered');
                }
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
            .right.box .btn.answered {
                background-color: #2196F3;
                color: white;
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
