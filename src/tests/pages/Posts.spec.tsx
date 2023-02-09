import { render, screen } from '@testing-library/react'
import Posts, { getStaticProps } from '../../pages/posts'

import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic')

const posts = [
  {
    slug: 'my-new-post',
    title: 'title-post',
    excerpt: 'post-excerpt',
    updatedAt: '04-01-2021'
  }
]

describe('Posts page', () => {
  it('render corretly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('title-post')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByType: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [{ type: 'heading', text: 'title-post' }],
              content: [{ type: 'paragraph', text: 'post-excerpt' }]
            },
            last_publication_date: '04-01-2021'
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'my-new-post',
              title: 'title-post',
              excerpt: 'post-excerpt',
              updatedAt: '01 de abril de 2021'
            }
          ]
        }
      })
    )
  })
})
