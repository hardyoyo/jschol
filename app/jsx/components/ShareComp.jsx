// ##### Share Component ##### //

import React from 'react'
import $ from 'jquery'

class ShareComp extends React.Component {
  getLink = (id, service) => {
    $.getJSON("/api/mediaLink/"+id+"/"+service).done((data) => {
      window.location = data.url
    }).fail((jqxhr, textStatus, err)=> {
      console.log("Failed! textStatus=", textStatus, ", err=", err)
    })
  }

  render() {
    let p = this.props
    return (
      <details className="c-share">
        <summary>Share</summary>
        <ul className="c-share__list">
          <li><a href="#" className="c-share__facebook" onClick={() => {this.getLink(p.id, "facebook")}}>Facebook</a></li>
          <li><a href="#" className="c-share__twitter" onClick={() => {this.getLink(p.id, "twitter")}}>Twitter</a></li>
          <li><a href="#" className="c-share__email" onClick={() => {this.getLink(p.id, "email")}}>Email</a></li>
          <li><a href="#" onClick={() => {this.getLink(p.id, "mendeley")}}>Mendeley</a></li>
          <li><a href="#" onClick={() => {this.getLink(p.id, "citeulike")}}>CiteULike</a></li>
        </ul>
      </details>
    )
  }
}

module.exports = ShareComp;