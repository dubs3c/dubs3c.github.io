import React, { Component } from 'react'
import avatar from '../../content/images/glitch-greek.jpg'
import kofi from '../../content/thumbnails/kofi.png'

export default class UserInfo extends Component {
  render() {
    return (
      <aside className="note">
        <div className="container note-container">
          <div className="flex-author">
            <div className="flex-avatar">
              <img className="avatar" src={avatar} alt="dubs3c" />
            </div>
            <div>
              <br />
              <p>
                {`Security Consultant | Offensive Security | OSCP | Bounty Hunter. Enjoys to build things and break things.`}
              </p>

              <div className="flex">
                <a
                  href="https://ko-fi.com/dubs3c"
                  className="donate-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={kofi} className="coffee-icon" alt="Coffee icon" />
                  Buy me a coffee!
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>
    )
  }
}
