import React from 'react';

const faqs = [
  {
    question: "Comment fonctionne TinderWork ?",
    answer: "TinderWork est une plateforme de matching entre candidats et recruteurs inspirée de Tinder. Vous pouvez swiper, matcher et discuter avec des employeurs ou des candidats selon votre profil."
  },
  {
    question: "Comment modifier mon profil ?",
    answer: "Cliquez sur le bouton 'Profil' dans la barre de navigation ou sur le dashboard, puis cliquez sur 'Modifier mon profil'."
  },
  {
    question: "Comment puis-je discuter avec un match ?",
    answer: "Une fois que vous avez un match, rendez-vous dans l'onglet 'Conversations' pour discuter avec vos correspondances."
  },
  {
    question: "Comment publier une offre d'emploi ?",
    answer: "Si vous êtes recruteur, cliquez sur 'Publier une annonce' dans le dashboard et remplissez le formulaire."
  },
  {
    question: "Mes informations sont-elles confidentielles ?",
    answer: "Oui, vos informations personnelles ne sont visibles que par les utilisateurs avec lesquels vous avez matché ou postulé."
  }
];

const FAQ = () => {
  return (
    <div className="main-container">
      <div className="container">
        <div className="modern-header mb-5">
          <h1 className="gradient-text mb-1">FAQ</h1>
          <p className="text-muted mb-0">Questions fréquentes sur TinderWork</p>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="modern-card p-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="mb-4 animate-fade-in">
                  <h4 className="fw-bold gradient-text mb-2">
                    <i className="fas fa-question-circle me-2"></i>
                    {faq.question}
                  </h4>
                  <p className="text-muted mb-0" style={{ lineHeight: '1.7' }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 