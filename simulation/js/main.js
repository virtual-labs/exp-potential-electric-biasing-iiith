//Your JavaScript goes in here

        let canvas = document.getElementById('drawCanvas');
        let ctx = canvas.getContext('2d');
        let selectedQuestion = null;
        let connections = [];
        let correctAnswers = {
            "1": "1",
            "2": "2",
            "3": "3",
            "4": "4",
            "5": "5",
            "6": "6"
        };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawConnections();
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        document.querySelectorAll('.question').forEach(question => {
            question.addEventListener('click', function() {
                if (selectedQuestion) {
                    selectedQuestion.classList.remove('selected');
                }
                this.classList.add('selected');
                selectedQuestion = this;
            });
        });

        document.querySelectorAll('.answer').forEach(answer => {
            answer.addEventListener('click', function() {
                if (selectedQuestion) {
                    connections = connections.filter(conn => 
                        conn.questionId !== selectedQuestion.dataset.id
                    );
                    
                    let connection = {
                        questionId: selectedQuestion.dataset.id,
                        answerId: this.dataset.id,
                        questionEl: selectedQuestion,
                        answerEl: this
                    };
                    connections.push(connection);
                    drawConnections();
                    selectedQuestion.classList.remove('selected');
                    selectedQuestion = null;
                }
            });
        });

        document.getElementById('checkBtn').addEventListener('click', function() {
            let score = 0;
            connections.forEach(conn => {
                if (correctAnswers[conn.questionId] === conn.answerId) {
                    conn.questionEl.classList.add('correct');
                    conn.answerEl.classList.add('correct');
                    score++;
                } else {
                    conn.questionEl.classList.add('incorrect');
                    conn.answerEl.classList.add('incorrect');
                }
            });
            document.getElementById('score').textContent = 
                `Score: ${score} out of ${Object.keys(correctAnswers).length} correct`;
        });

        document.getElementById('resetBtn').addEventListener('click', function() {
            connections = [];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (selectedQuestion) {
                selectedQuestion.classList.remove('selected');
                selectedQuestion = null;
            }
            document.querySelectorAll('.question, .answer').forEach(el => {
                el.classList.remove('correct', 'incorrect', 'selected');
            });
            document.getElementById('score').textContent = '';
        });

        function drawConnections() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            connections.forEach(conn => {
                let questionRect = conn.questionEl.getBoundingClientRect();
                let answerRect = conn.answerEl.getBoundingClientRect();
                
                let startX = questionRect.right;
                let startY = questionRect.top + (questionRect.height/2);
                let endX = answerRect.left;
                let endY = answerRect.top + (answerRect.height/2);
                
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                
                // Create a curved line
                let controlX = startX + (endX - startX) / 2;
                ctx.bezierCurveTo(
                    controlX, startY,
                    controlX, endY,
                    endX, endY
                );
                
                // Create gradient for line
                let gradient = ctx.createLinearGradient(startX, startY, endX, endY);
                gradient.addColorStop(0, '#2196F3');
                gradient.addColorStop(1, '#03A9F4');
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.stroke();
                
                // Add dots at connection points
                ctx.beginPath();
                ctx.arc(startX, startY, 4, 0, Math.PI * 2);
                ctx.arc(endX, endY, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#2196F3';
                ctx.fill();
            });
        }

        window.addEventListener('scroll', drawConnections);









