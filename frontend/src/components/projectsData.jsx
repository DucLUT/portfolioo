const projects = [
    {
        title: "SAAS",
        link: "https://github.com/Neniuk/saas-project",
        description: (
            <p>
                The repo is in private and the project is under construction. Making an application for user to create 
                Menu with bunch of tools and able to turn it into a qr code so customer can buy and pay on the browser.
            </p>
        ),
        technologies: ["TypeScript", "Reactjs", "Gin", "Go"],
    },
    {
        title: "Junction Hackathon 2024",
        link: "https://github.com/DucLUT/Junction_2024",
        description: (
            <p>
                Making the 3D model from floor plans. Uses React, Three.js for front-end to construct
                and display the model. FastAPI and OpenCV for back-end, to extract walls from floor plan.
            </p>
        ),
        technologies: ["TypeScript", "Reactjs", "Threejs", "FastAPI", "Python"],
    },
    // Add more projects here if needed
];

export default projects;