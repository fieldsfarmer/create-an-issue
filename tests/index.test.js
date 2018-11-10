const path = require('path')
const IssueCreator = require('..')

describe('create-an-issue', () => {
  let issueCreator, github

  beforeEach(() => {
    issueCreator = new IssueCreator()
    github = { issues: { create: jest.fn() } }

    issueCreator.tools.workspace = path.join(__dirname, 'fixtures')
    issueCreator.tools.context.payload = { repository: { owner: { login: 'JasonEtco' }, name: 'waddup' } }
    issueCreator.tools.createOctokit = jest.fn(() => github)
  })

  it('creates a new issue', async () => {
    await issueCreator.go()
    expect(github.issues.create).toHaveBeenCalled()
    expect(github.issues.create.mock.calls).toMatchSnapshot()
  })

  it('creates a new issue from a different template', async () => {
    issueCreator = new IssueCreator('.github/different-template.md')
    issueCreator.tools.workspace = path.join(__dirname, 'fixtures')
    issueCreator.tools.context.payload = { repository: { owner: { login: 'JasonEtco' }, name: 'waddup' } }
    issueCreator.tools.createOctokit = jest.fn(() => github)

    await issueCreator.go()
    expect(github.issues.create).toHaveBeenCalled()
    expect(github.issues.create.mock.calls[0][0].title).toBe('Different file')
  })
})