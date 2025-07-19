<?php

use BitApps\Social\Factories\ProxyRequestParserFactory;
use BitApps\Social\Utils\Hash;

/**
 * @internal
 *
 * @coversNothing
 */
class ProxyRequestParserFactoryTest extends BaseTestCase
{
    public function setUp() : void
    {
        parent::setUp();
    }

    public function tearDown() : void
    {
        parent::tearDown();
    }

    public function testProxyParserFactory()
    {
        $encryptedPass = Hash::encrypt('secret');

        $request = [
            'headers' => [
                'Content-Type'   => 'application/json',
                'Authorization1' => [
                    'Basic ',
                    [
                        'encryption' => 'base64_encode',
                        'value'      => [
                            'username',
                            ':',
                            [
                                'encryption' => 'hmac_decrypt',
                                'value'      => $encryptedPass
                            ]
                        ]
                    ]
                ],
                'Authorization2' => [
                    'encryption' => 'hmac_decrypt',
                    'value'      => $encryptedPass
                ],
                'Authorization3' => [
                    'Bearer ',
                    [
                        'encryption' => 'hmac_decrypt',
                        'value'      => $encryptedPass
                    ]
                ],
                'Authorization4' => [
                    'Bearer ',
                    Hash::decrypt($encryptedPass)
                ],
                'Authorization5' => 'Bearer ' . Hash::decrypt($encryptedPass),
                'Authorization6' => [
                    'encryption' => 'base64_encode',
                    'value'      => [
                        'encryption' => 'hmac_decrypt',
                        'value'      => $encryptedPass
                    ]
                ],
                'Authorization7' => [
                    'encryption' => 'base64_encode',
                    'value'      => [
                        'encryption' => 'base64_encode',
                        'value'      => [
                            'encryption' => 'hmac_decrypt',
                            'value'      => $encryptedPass
                        ]
                    ]
                ]
            ],
            'method' => 'GET',
            'url'    => 'http://github.api/',
        ];

        $response = ProxyRequestParserFactory::parse($request);

        $this->assertIsArray($response);

        $this->assertTrue(key_exists('headers', $response));
        $this->assertTrue(key_exists('method', $response));
        $this->assertTrue(key_exists('url', $response));

        $this->assertEquals($response['method'], 'GET');
        $this->assertEquals($response['url'], 'http://github.api/');
        $this->assertEquals($response['headers']['Content-Type'], 'application/json');
        $this->assertEquals($response['headers']['Authorization1'], 'Basic dXNlcm5hbWU6c2VjcmV0');
        $this->assertEquals($response['headers']['Authorization2'], 'secret');
        $this->assertEquals($response['headers']['Authorization3'], 'Bearer secret');
        $this->assertEquals($response['headers']['Authorization4'], 'Bearer secret');
        $this->assertEquals($response['headers']['Authorization5'], 'Bearer secret');
        $this->assertEquals($response['headers']['Authorization6'], 'c2VjcmV0');
        $this->assertEquals($response['headers']['Authorization7'], 'YzJWamNtVjA=');
    }
}
