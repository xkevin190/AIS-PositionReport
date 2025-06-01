import { Test, TestingModule } from '@nestjs/testing';
import { AisGateway } from './ais.gateway';
import { AisService } from './ais.service';
import { WebSocket } from 'ws';

jest.mock('ws');

describe('AisGateway', () => {
  let gateway: AisGateway;
  let aisService: AisService;
  let mockSocket: any;

  beforeEach(async () => {
    const mockAisService = {
      handlePositionReport: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AisGateway,
        {
          provide: AisService,
          useValue: mockAisService,
        },
      ],
    }).compile();

    gateway = module.get<AisGateway>(AisGateway);
    aisService = module.get<AisService>(AisService);

    mockSocket = {
      on: jest.fn(),
      send: jest.fn(),
    };

    // @ts-ignore
    WebSocket.mockImplementation(() => mockSocket);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call connectToAisStream on module init', () => {
    const spy = jest.spyOn<any, any>(gateway as any, 'connectToAisStream');
    gateway.onModuleInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should send correct payload on WebSocket open', () => {
    gateway['connectToAisStream']();

    const openCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === 'open',
    )[1];

    process.env.AISSTREAM_API_KEY = 'TEST_KEY';

    openCallback();

    expect(mockSocket.send).toHaveBeenCalledWith(
      JSON.stringify({
        BoundingBoxes: [
          [
            [90, -180],
            [-90, 180],
          ],
        ],
        Apikey: 'TEST_KEY',
        filterMessageTypess: ['PositionReport'],
      }),
    );
  });

  it('should handle incoming messages and call aisService.handlePositionReport', async () => {
    gateway['connectToAisStream']();

    const messageCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === 'message',
    )[1];

    const mockMessage = {
      Message: {
        PositionReport: {
          Cog: 13.5,
        },
      },
      MessageType: 'PositionReport',
      MetaData: {
        MMSI: 368102870,
        MMSI_String: 368102870,
        ShipName: 'BAYOU TECHE         ',
        latitude: 25.774293333333333,
        longitude: -80.16267166666667,
        time_utc: '2025-06-01 17:44:34.10108763 +0000 UTC',
      },
    };

    await messageCallback(Buffer.from(JSON.stringify(mockMessage)));

    expect(aisService.handlePositionReport).toHaveBeenCalledWith(mockMessage);
  });

  it('should reconnect after close', () => {
    jest.useFakeTimers();

    gateway['connectToAisStream']();

    const closeCallback = mockSocket.on.mock.calls.find(
      ([event]) => event === 'close',
    )[1];

    const reconnectSpy = jest.spyOn<any, any>(
      gateway as any,
      'connectToAisStream',
    );

    closeCallback();
    jest.advanceTimersByTime(5000);

    expect(reconnectSpy).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});
