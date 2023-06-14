<?php

namespace App\Test\Controller;

use App\Entity\Plant;
use App\Repository\PlantRepository;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class PlantControllerTest extends WebTestCase
{
    private KernelBrowser $client;
    private PlantRepository $repository;
    private string $path = '/plant/';

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->repository = static::getContainer()->get('doctrine')->getRepository(Plant::class);

        foreach ($this->repository->findAll() as $object) {
            $this->repository->remove($object, true);
        }
    }

    public function testIndex(): void
    {
        $crawler = $this->client->request('GET', $this->path);

        self::assertResponseStatusCodeSame(200);
        self::assertPageTitleContains('Plant index');

        // Use the $crawler to perform additional assertions e.g.
        // self::assertSame('Some text on the page', $crawler->filter('.p')->first());
    }

    public function testNew(): void
    {
        $originalNumObjectsInRepository = count($this->repository->findAll());

        $this->markTestIncomplete();
        $this->client->request('GET', sprintf('%snew', $this->path));

        self::assertResponseStatusCodeSame(200);

        $this->client->submitForm('Save', [
            'plant[name]' => 'Testing',
            'plant[description]' => 'Testing',
            'plant[latitude]' => 'Testing',
            'plant[longitude]' => 'Testing',
            'plant[photo]' => 'Testing',
            'plant[user]' => 'Testing',
        ]);

        self::assertResponseRedirects('/plant/');

        self::assertSame($originalNumObjectsInRepository + 1, count($this->repository->findAll()));
    }

    public function testShow(): void
    {
        $this->markTestIncomplete();
        $fixture = new Plant();
        $fixture->setName('My Title');
        $fixture->setDescription('My Title');
        $fixture->setLatitude('My Title');
        $fixture->setLongitude('My Title');
        $fixture->setPhoto('My Title');
        $fixture->setUser('My Title');

        $this->repository->save($fixture, true);

        $this->client->request('GET', sprintf('%s%s', $this->path, $fixture->getId()));

        self::assertResponseStatusCodeSame(200);
        self::assertPageTitleContains('Plant');

        // Use assertions to check that the properties are properly displayed.
    }

    public function testEdit(): void
    {
        $this->markTestIncomplete();
        $fixture = new Plant();
        $fixture->setName('My Title');
        $fixture->setDescription('My Title');
        $fixture->setLatitude('My Title');
        $fixture->setLongitude('My Title');
        $fixture->setPhoto('My Title');
        $fixture->setUser('My Title');

        $this->repository->save($fixture, true);

        $this->client->request('GET', sprintf('%s%s/edit', $this->path, $fixture->getId()));

        $this->client->submitForm('Update', [
            'plant[name]' => 'Something New',
            'plant[description]' => 'Something New',
            'plant[latitude]' => 'Something New',
            'plant[longitude]' => 'Something New',
            'plant[photo]' => 'Something New',
            'plant[user]' => 'Something New',
        ]);

        self::assertResponseRedirects('/plant/');

        $fixture = $this->repository->findAll();

        self::assertSame('Something New', $fixture[0]->getName());
        self::assertSame('Something New', $fixture[0]->getDescription());
        self::assertSame('Something New', $fixture[0]->getLatitude());
        self::assertSame('Something New', $fixture[0]->getLongitude());
        self::assertSame('Something New', $fixture[0]->getPhoto());
        self::assertSame('Something New', $fixture[0]->getUser());
    }

    public function testRemove(): void
    {
        $this->markTestIncomplete();

        $originalNumObjectsInRepository = count($this->repository->findAll());

        $fixture = new Plant();
        $fixture->setName('My Title');
        $fixture->setDescription('My Title');
        $fixture->setLatitude('My Title');
        $fixture->setLongitude('My Title');
        $fixture->setPhoto('My Title');
        $fixture->setUser('My Title');

        $this->repository->save($fixture, true);

        self::assertSame($originalNumObjectsInRepository + 1, count($this->repository->findAll()));

        $this->client->request('GET', sprintf('%s%s', $this->path, $fixture->getId()));
        $this->client->submitForm('Delete');

        self::assertSame($originalNumObjectsInRepository, count($this->repository->findAll()));
        self::assertResponseRedirects('/plant/');
    }
}
