<?php

use BitApps\Social\Deps\BitApps\WPKit\Helpers\JSON;

/**
 * @internal
 *
 * @coversNothing
 */
class ScheduleIndexTest extends BaseTestCase
{
    private $method;

    private $baseUrl;

    public function setUp() : void
    {
        parent::setUp();

        $this->method = 'GET';

        $this->baseUrl = 'schedule';
    }

    public function tearDown() : void
    {
        parent::tearDown();
    }

    public function testIndex()
    {
        $this->call($this->method, $this->baseUrl . '/1/10');

        $response = JSON::maybeDecode($this->_last_response);

        $this->assertSame('success', $response->status);

        $this->assertIsObject($response);

        $this->assertCount(7, (array) $response->data);

        $this->assertSame(0, $response->data->pages);

        $this->assertSame(0, $response->data->total);

        $this->assertSame('10', $response->data->per_page);
    }
}
