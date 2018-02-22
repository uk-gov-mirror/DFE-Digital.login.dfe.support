jest.mock('request-promise');
jest.mock('login.dfe.jwt-strategies');
jest.mock('./../../../src/infrastructure/config', () => require('./../../utils').configMockFactory({
  directories: {
    type: 'api',
    service: {
      url: 'http://directories.test',
    },
  },
}));

const rp = require('request-promise');
const jwtStrategy = require('login.dfe.jwt-strategies');
const { getPageOfInvitations } = require('./../../../src/infrastructure/directories/api');

const pageNumber = 1;
const correlationId = 'abc123';
const apiResponse = {
  invitations: [{
    firstName: 'User',
    lastName: 'One',
    email: 'user.one@unit.test',
    keyToSuccessId: '1234567',
    tokenSerialNumber: '1234567890',
    id: 'c5e57976-0bef-4f55-b16f-f63a241c9bfa',
  }],
  numberOfPages: 1,
  page: 1,
};

describe('when getting a page of users from directories api', () => {
  beforeEach(() => {
    rp.mockReset();
    rp.mockImplementation(() => {
      return apiResponse;
    });

    jwtStrategy.mockReset();
    jwtStrategy.mockImplementation(() => {
      return {
        getBearerToken: jest.fn().mockReturnValue('token'),
      };
    })
  });

  it('then it should call users resource with page', async () => {
    await getPageOfInvitations(pageNumber, correlationId);

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0]).toMatchObject({
      method: 'GET',
      uri: 'http://directories.test/invitations?page=1',
    });
  });

  it('then it should use the token from jwt strategy as bearer token', async () => {
    await getPageOfInvitations(pageNumber, correlationId);

    expect(rp.mock.calls[0][0]).toMatchObject({
      headers: {
        authorization: 'bearer token',
      },
    });
  });

  it('then it should include the correlation id', async () => {
    await getPageOfInvitations(pageNumber, correlationId);

    expect(rp.mock.calls[0][0]).toMatchObject({
      headers: {
        'x-correlation-id': correlationId,
      },
    });
  });

  it('then it should return api result', async () => {
    const actual = await getPageOfInvitations(pageNumber, correlationId);

    expect(actual).toMatchObject(apiResponse);
  });
});
