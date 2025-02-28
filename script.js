document.addEventListener("DOMContentLoaded", function () {
    console.log("Portfolio Loaded!");

    // Smooth scrolling for navbar links
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).scrollIntoView({ behavior: "smooth" });
        });
    });

    // Dynamically Add More Projects
    const projects = [
        { img: "project1.jpg", title: "AI Model", desc: "Built an AI model for detecting objects." },
        { img: "project2.jpg", title: "Self-Driving Car", desc: "Worked on a Self-Driving AI." }
    ];

    const projectContainer = document.querySelector("#project-list");

    projects.forEach(proj => {
        const projectCard = document.createElement("div");
        projectCard.className = "col-md-4";
        projectCard.innerHTML = `
            <div class="card">
                <img src="${proj.img}" class="card-img-top" alt="${proj.title}">
                <div class="card-body">
                    <h5 class="card-title">${proj.title}</h5>
                    <p class="card-text">${proj.desc}</p>
                    <a href="#" class="btn btn-primary">View Details</a>
                </div>
            </div>
        `;
        projectContainer.appendChild(projectCard);
    });

    // Contact Form Submission
    document.getElementById("contact-form").addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Thank you! Your message has been sent.");
    });
});
