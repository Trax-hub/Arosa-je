<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;


class UserController extends AbstractController
{
    #[Route('/user', name: 'app_user_index', methods: ['GET'])]
    public function index(UserRepository $userRepository): Response
    {
        if (null === $this->getUser() || ["ROLES_ADMIN"] !== $this->getUser()->getRoles()) {
            return $this->redirectToRoute('app_plant_index');
           }
        return $this->render('user/index.html.twig', [
            'users' => $userRepository->findAll(),
        ]);
    }

    #[Route('utilisateur/new', name: 'app_user_new', methods: ['GET', 'POST'])]
    public function new(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $userPasswordHasher): Response
    {
        if (null !== $this->getUser()) {
            return $this->redirectToRoute('app_plant_index');
        }
        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user->setPassword(
                $userPasswordHasher->hashPassword(
                    $user,
                    $form->get('password')->getData()
                )
            );

            $userRepository->save($user, true);

            return $this->redirectToRoute('login', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('user/new.html.twig', [
            'user' => $user,
            'form' => $form,
        ]);
    }

    #[Route('user/{id}', name: 'app_user_show', methods: ['GET'])]
    public function show(User $user): Response
    {
        if (null === $this->getUser()) {
            return $this->redirectToRoute('app_plant_index');
        }
        if (["ROLES_ADMIN"] !== $this->getUser()->getRoles()) {
            return $this->redirectToRoute('app_plant_index');
        }
        return $this->render('user/show.html.twig', [
            'user' => $user,
        ]);
    }

    #[Route('user/{id}/edit', name: 'app_user_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, User $user, UserRepository $userRepository): Response
    {
        if (null === $this->getUser()) {
            return $this->redirectToRoute('app_plant_index');
        }
        if (["ROLES_ADMIN"] !== $this->getUser()->getRoles()) {
            return $this->redirectToRoute('app_plant_index');
        }
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $userRepository->save($user, true);

            return $this->redirectToRoute('app_user_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('user/edit.html.twig', [
            'user' => $user,
            'form' => $form,
        ]);
    }

    #[Route('user/{id}', name: 'app_user_delete', methods: ['POST'])]
    public function delete(Request $request, User $user, UserRepository $userRepository): Response
    {
        if (null === $this->getUser()) {
            return $this->redirectToRoute('app_plant_index');
        }
        if (["ROLES_ADMIN"] !== $this->getUser()->getRoles()) {
            return $this->redirectToRoute('app_plant_index');
        }
        if ($this->isCsrfTokenValid('delete' . $user->getId(), $request->request->get('_token'))) {
            $userRepository->remove($user, true);
        }

        return $this->redirectToRoute('app_user_index', [], Response::HTTP_SEE_OTHER);
    }
}
