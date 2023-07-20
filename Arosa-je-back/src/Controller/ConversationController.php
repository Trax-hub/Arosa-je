<?php

namespace App\Controller;

use App\Entity\Conversation;
use App\Entity\User;
use App\Form\ConversationType;
use App\Repository\ConversationRepository;
use JetBrains\PhpStorm\NoReturn;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/conversation')]
class ConversationController extends AbstractController
{
    #[Route('/', name: 'app_conversation_index', methods: ['GET'])]
    public function index(ConversationRepository $conversationRepository): Response
    {
        return $this->render('conversation/index.html.twig', [
            'conversations' => $conversationRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_conversation_new', methods: ['GET', 'POST'])]
    public function new(Request $request, ConversationRepository $conversationRepository): Response
    {
        $conversation = new Conversation();
        $form = $this->createForm(ConversationType::class, $conversation);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $conversationRepository->save($conversation, true);

            return $this->redirectToRoute('app_conversation_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('conversation/new.html.twig', [
            'conversation' => $conversation,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_conversation_show', methods: ['GET'])]
    public function show(Conversation $conversation): Response
    {
        return $this->render('conversation/show.html.twig', [
            'conversation' => $conversation,
        ]);
    }

    #[Route('/user', name: 'user_conversations', methods: ['GET'])]
    public function alluserConversations(User $user, ConversationRepository $conversationRepository): Response
    {
        $conversations = $conversationRepository->findBy(['user' => $user ]);

        if ($conversations !== null) {
            return $this->json([
                'conversations' => $conversations
            ]);
        }
        return $this->json([
            'aa' => 'aa'
        ]);

    }

    #[Route('/{id}/edit', name: 'app_conversation_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Conversation $conversation, ConversationRepository $conversationRepository): Response
    {
        $form = $this->createForm(ConversationType::class, $conversation);
       $form->handleRequest($request);

          if ($form->isSubmitted() && $form->isValid()) {
          $conversationRepository->save($conversation, true);

          return $this->redirectToRoute('app_conversation_index', [], Response::HTTP_SEE_OTHER);
      }

      return $this->renderForm('conversation/edit.html.twig', [
          'conversation' => $conversation,
          'form' => $form,
      ]);
    }

    //#[Route('/{id}', name: 'app_conversation_delete', methods: ['POST'])]
    //public function delete(Request $request, Conversation $conversation, ConversationRepository $conversationRepository): Response
    //{
    //  if ($this->isCsrfTokenValid('delete'.$conversation->getId(), $request->request->get('_token'))) {
    //      $conversationRepository->remove($conversation, true);
    //  }

    //  return $this->redirectToRoute('app_conversation_index', [], Response::HTTP_SEE_OTHER);
    //}
}
