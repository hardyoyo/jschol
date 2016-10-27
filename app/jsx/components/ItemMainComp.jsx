// ##### Item View Tab: Main Component ##### //

import React from 'react'
import { PdfViewerComp } from '../components/AllComponents.jsx'

class ItemMainComp extends React.Component {
  render() { 
    let p = this.props,
        pub_web_loc = p.attrs["pub_web_loc"].map(function(node, i) {
          return (
            <span key={i}><a href={node}>{node}</a><br/></span>
          )
        }),
        abstr = p.attrs["abstract"],
        // Temporary styles till we get Joel's work
        rowStyle = {display: 'table'},
        leftStyle = {display: 'table-cell', width: '750px'},
        rightStyle = {display: 'table-cell', width: '100px', border: '1px solid black'},
        titleStyle = {fontSize: '1.2em'}
    return(
      <div className="content">
        <div style={rowStyle}>
          <div style={leftStyle}>
            <font style={titleStyle}>{p.title}</font> <br/>
            {p.pub_date} <ItemMainAuthorsComp authors={p.authors} changeTab={this.props.changeTab}/>
            {pub_web_loc.length > 0 && <div>{pub_web_loc}</div>}
          </div>
          <div style={rightStyle}>
            {p.rights}
          </div>
        </div>
        {abstr && <div><br/>Abstract<br/>{abstr}</div>}
        <hr/>
        <Content
          {...p}
        />
      </div>
    )
  }
}

class ItemMainAuthorsComp extends React.Component {
  handleClick(tab_id) {
    this.props.changeTab(tab_id)
  }

  render() {
    console.log(this.props)
    let p = this.props,
        a = p.authors,
        expand = false 
    if (p.authors && p.authors.length > 6) {
      a = a.slice(0, 5)
      expand = true 
    }
    let authorList = a.map((node,i) => <span key={i}>{node}</span>)
      .reduce((accu, elem) => {
        return accu === null ? [elem] : [...accu, '; ', elem]
      }, null)
    return (
      <span>
        { p.authors && <span>&#124; {authorList} {this.renderExpand(expand)}</span> }
      </span>
    )
  }

  renderExpand(expand) { return(
    <span>
      {expand && <a href="#" onClick={this.handleClick.bind(this, 4)}>et al.</a>}
    </span>
  )}
}

class Content extends React.Component {
  render() {
    let q = new Date(),
        today = new Date(q.getFullYear(),q.getMonth(),q.getDate()),
        withdrawn = new Date(this.props.attrs['withdrawn_date']) <= today ? true : false,
        embargoed = new Date(this.props.attrs['embargo_date']) > today ? true : false
    return (
    <div>
      {/* ToDo: Eventually we will use suppress_content to check for withdrawn/embargoed */}
      { withdrawn && this.renderNoContent("withdrawn", this.props.attrs['withdrawn_date']) }
      { embargoed && this.renderNoContent("embargoed", this.props.attrs['embargo_date']) }
      { !embargoed && !withdrawn && this.renderContent(this.props) }
    </div>
  )}

  renderContent(p) { return (
    <div>
      { this.props.content_type == "application/pdf" ? this.renderPdf(this.props) : null }
      { this.props.content_type == "html" ? this.renderHtml(this.props) : null }
    </div>
  )}

  renderPdf(p) { return (
    <div>
      Main text<br/>
      {/* Fetch PDF from a special place which supports returning CORS headers. E.g. transform item I
D "9k10r3sc" into:
          http://pub-eschol-stg.escholarship.org/raw_data/13030/pairtree_root/qt/9k/10/r3/sc/qt9k10r3
sc/content/qt9k10r3sc.pdf */}
      <PdfViewerComp url={"http://pub-eschol-stg.escholarship.org/raw_data/13030/pairtree_root/qt/" +
                     p.id.match(/(..?)/g).join("/") + "/qt" + p.id + "/content/qt" + p.id + ".pdf" }/
>
    </div>
  )}

  renderHtml(p) { return(
    <div>
      Main text<br/>
      Placeholder: ToDo
    </div>
  )}

  renderNoContent(reason, date) { return (
    <div>
    {reason=="withdrawn" && 
      <p>Withdrawn item:<br/>This item has been withdrawn.<br/><br/><br/></p>}
    {reason=="embargoed" && 
      <p>This item is embargoed until {date}.<br/><br/><br/></p>}
    </div>
  )}

}

module.exports = ItemMainComp;
