import React from "react";
import axios from "axios"
import Project from "./Project"

class ProjectList extends React.Component {
    state = {
        projects: []
    }

    componentDidMount() {
        axios
            .get("http://localhost:5000/api/projects")
            .then(res => {
                return this.setState(() => ({ projects: res.data })
                )
                    .catch(err => {
                        console.log(err)
                    })
            })
    }

    render() {
        return (
            this.state.projects.map(project => {
                return <Project key={project.id} project={project} />
            })
        )
    }
}

export default ProjectList;