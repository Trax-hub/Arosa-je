<?php

namespace App\Controller;

use App\Entity\Plant;
use App\Form\PlantType;
use App\Repository\PlantRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/plant')]
class PlantController extends AbstractController
{
    #[Route('/', name: 'app_plant_index', methods: ['GET', 'POST'])]
    public function index(PlantRepository $plantRepository): Response
    {
        return $this->render('plant/index.html.twig', [
            'plants' => $plantRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_plant_new', methods: ['GET', 'POST'])]
    public function new(Request $request, PlantRepository $plantRepository): Response
    {
        $plant = new Plant();
        $form = $this->createForm(PlantType::class, $plant);
        $form->handleRequest($request);
        $plant->setUser($this->getUser());

        if ($form->isSubmitted() && $form->isValid()) {
            $plantRepository->save($plant, true);

            return $this->redirectToRoute('app_plant_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('plant/new.html.twig', [
            'plant' => $plant,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_plant_show', methods: ['GET'])]
    public function show(Plant $plant): Response
    {
        return $this->render('plant/show.html.twig', [
            'plant' => $plant,
        ]);
    }

    #[Route('/count', name: 'app_plant_count', methods: ['GET'])]
    public function count(PlantRepository $plantRepository): JsonResponse
    {
        $plants = $plantRepository->findAll();

        $data = [
            'nbPlants' => count($plants),
        ];

        return new JsonResponse($data, 200);
    }

//    #[Route('/{id}/edit', name: 'app_plant_edit', methods: ['GET', 'POST'])]
//  public function edit(Request $request, Plant $plant, PlantRepository $plantRepository): Response
//  {
//    // on ne l'utilise pas
//        $form = $this->createForm(PlantType::class, $plant);
//        $form->handleRequest($request);

//        if ($form->isSubmitted() && $form->isValid()) {
//            $plantRepository->save($plant, true);

//            return $this->redirectToRoute('app_plant_index', [], Response::HTTP_SEE_OTHER);
//        }

//        return $this->renderForm('plant/edit.html.twig', [
//            'plant' => $plant,
//            'form' => $form,
//        ]);
//    }

    #[Route('/{id}', name: 'app_plant_delete', methods: ['POST'])]
    public function delete(Request $request, Plant $plant, PlantRepository $plantRepository): Response
    {
        if( null === $this->getUser() || ["ROLES_ADMIN"] !== $this->getUser()->getRoles()){
            return $this->redirectToRoute('login');  // voir pour une erreur 401
        }

        if ($this->isCsrfTokenValid('delete'.$plant->getId(), $request->request->get('_token'))) {
            $plantRepository->remove($plant, true);
        }

        return $this->redirectToRoute('app_plant_index', [], Response::HTTP_SEE_OTHER);
    }
}
