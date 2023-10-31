const CreateTeacher = async (req, res) => {
  try {
    if (!req.teachingCenterId)
      return res.status(401).json({ message: "Un authorized" });

    const { name, age, phone_number, login, password, deggree } = req.body;    
    

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
