// ##### Sidebar Text Widget Component ##### //

import React from 'react'
import PropTypes from 'prop-types'
import EditableComp from './EditableComp.jsx'
import WysiwygEditorComp from './WysiwygEditorComp.jsx'

export default class EditableSidebarTextComp extends React.Component
{
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    html: PropTypes.string.isRequired
  }

  state = { newText: null }

  render() { let p = this.props; return(
    <EditableComp canDelete widgetName="Sidebar Text"
                  title={p.title} html={p.html}
                  renderEditor={this.renderEditor}
                  onSave={() => this.props.onSave(this.state.newText)}>
      <SidebarTextComp title={p.title} html={p.html}/>
    </EditableComp>
  )}

  renderEditor = () => // properly binds 'this'
    <WysiwygEditorComp html={this.props.html}
                      onChange={(newText) => this.setState({newText: newText})}/>
}

class SidebarTextComp extends React.Component
{
  static propTypes = {
    title: PropTypes.string.isRequired,
    html: PropTypes.string.isRequired
  }

  render() { return(
    <section className="o-columnbox1">
      <header>
        <h1>{this.props.title}</h1>
      </header>
      <div dangerouslySetInnerHTML={{__html: this.props.html}}/>
    </section>)
  }
}
