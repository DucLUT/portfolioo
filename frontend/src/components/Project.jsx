import React, {useState} from "react"
import projects from "./projectsData"
import Pill from "./Pill"
const Project = () => {
    return (
        <div className="flex flex-col gap-3">
            {projects.map((project) => (
                <div key={project.title}
                className="bg-secondaryColor border-innerBorderColor flex flex-col gap-2 rounded-md border-2 border-solid p-6">
                    <div className="mb-2 flex flex-row gap-4">
                        <iframe
                            src="https://giphy.com/embed/GkD4U3VfiIbzcBhQNu"
                            width="24"
                            height="24"
                            style={{ position: "relative" }}
                            frameBorder="0"
                            className="giphy-embed"
                            allowFullScreen
                            title="Star Animation"
                        ></iframe>
                        <a href={project.link} className="project-link">
                            <h3 className="border-accentSecondaryColor inline-block border-b-2">
                                {project.title}
                            </h3>
                        </a>
                </div>
                <div className="flex flex-col gap-4 pl-6">
                    <div>{project.description}</div>
                </div>
                <div className="flex flex-row flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                                <Pill key={tech} text={tech} type="blank" />
                            ))}
                </div>

                </div>
            ))}
        </div>
    )
}

export default Project