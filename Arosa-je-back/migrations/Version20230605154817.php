<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230605154817 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE post DROP FOREIGN KEY FK_5A8A6C8D7E9E4C8C');
        $this->addSql('DROP INDEX UNIQ_5A8A6C8D7E9E4C8C ON post');
        $this->addSql('ALTER TABLE post ADD photo VARCHAR(255) NOT NULL, DROP photo_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE post ADD photo_id INT DEFAULT NULL, DROP photo');
        $this->addSql('ALTER TABLE post ADD CONSTRAINT FK_5A8A6C8D7E9E4C8C FOREIGN KEY (photo_id) REFERENCES photo (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_5A8A6C8D7E9E4C8C ON post (photo_id)');
    }
}
