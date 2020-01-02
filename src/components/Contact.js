import React, { Component } from 'react'
import { Link } from 'gatsby'

export default class Contact extends Component {
  render() {
    return (
      <>
        <h1>Stay in Touch</h1>
        <p>You can contact me via email or find me around the web.</p>
        <ul>
          <li>
            <strong>Email</strong>: <a href="mailto:michael@dubell.io">michael@dubell.io</a>
          </li>
          <li>
            <strong>GitHub</strong>:{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/mjdubell">
              mjdubell
            </a>
          </li>
          <li>
            <strong>Twitter</strong>:{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/dubs3c">
              dubs3c
            </a>
          </li>
          <li>
            <strong>Keybase: </strong>
            <a target="_blank" rel="noopener noreferrer" href="https://keybase.io/mjdubell">
              mjdubell
            </a>
          </li>
          <li>
            <strong>Feed</strong>: <Link to="/rss.xml">RSS</Link>
          </li>
        </ul>
      </>
    )
  }
}
