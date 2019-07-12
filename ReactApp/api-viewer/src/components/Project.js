import React from "react"

class Project extends React.Component {
    render() {
        return (
            <div>
                {this.props.project.name}
            </div>
        )
    }
}

export default Project;