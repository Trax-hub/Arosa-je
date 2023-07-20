<?php

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationSuccessResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Http\Authentication\AuthenticationSuccessHandler as BaseAuthenticationSuccessHandler;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class AuthenticationSuccessHandler extends BaseAuthenticationSuccessHandler
{
    protected $jwtManager;

    public function __construct(JWTTokenManagerInterface $jwtManager)
    {
        $this->jwtManager = $jwtManager;
    }

    public function handleAuthenticationSuccess(UserInterface $user, $jwtToken = null, $jwtRefreshToken = null): JWTAuthenticationSuccessResponse
    {
        $jwtToken = $this->jwtManager->create($user);

        $data = [
            'message' => 'Connexion réussie',
            'token' => $jwtToken,
            'user' => [
                'id' => $user->getId(),
                'username' => $user->getPseudo(),
                'email' => $user->getEmail(),
                'role' => $user->getRoles(),
            ],
        ];

        $event = new AuthenticationSuccessEvent($data, $user, new JWTAuthenticationSuccessResponse($jwtToken));

        return new JWTAuthenticationSuccessResponse($event->getData());
    }
}
