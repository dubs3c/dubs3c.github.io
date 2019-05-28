import React, { Component } from 'react'

export default class SimpleListing extends Component {
  render() {
    const { data } = this.props

    return (
      <section className="simple-posts">
        {data.map(post => {
          return (
            <a href={post.path} key={post.title} target="_blank" rel="noopener noreferrer">
              <div className="each">
                <h2>
                  {
                    post.img > 0 && 
                      <img src={post.img} alt={post.title} />
                  }
                  <strong>{post.title}</strong> <span class="podcast-desc">{post.description}</span>
                </h2>
              </div>
            </a>
          )
        })}
      </section>
    )
  }
}
