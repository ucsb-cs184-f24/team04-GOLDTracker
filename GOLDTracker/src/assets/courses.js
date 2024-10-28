const courses = [
    {
      id: "1",
      code: "CMPSC 184",
      time: "M W 12:00-1:15pm",
      professor: "Prof: Hollerer T",
      sections: [
        { id: "0", time: "F 10:00-10:50 am", space: "Closed", following: true },
        { id: "1", time: "F 11:00-11:50 am", space: 3, following: false },
        { id: "2", time: "F 12:00-12:50 pm", space: 10, following: false },
      ],
      location: "Location: ILP 2211",
      quarter: "Fall 2024",
      fullTitle: "Mobile Applicaiton",
      devDescription: "This course is about mobile application development.",
      preRaq: "Computer Science 56 or 156",
      gradingOpt: "Letter",
      LimitedMajor: "Computer Science",
    },
    {
      id: "2",
      code: "CMPSC 184",
      time: "M W 12:00-1:15pm",
      professor: "Prof: Hollerer T",
      sections: [
        { id: "0", time: "F 10:00-10:50 am", space: "Closed", following: true },
        { id: "1", time: "F 11:00-11:50 am", space: 3, following: false },
        { id: "2", time: "F 12:00-12:50 pm", space: 10, following: false },
      ],
    },
    {
        id: "3",
        code: "CMPSC 184",
        time: "M W 12:00-1:15pm",
        professor: "Prof: Hollerer T",
        sections: [
          { id: "0", time: "F 10:00-10:50 am", space: "Closed", following: true },
          { id: "1", time: "F 11:00-11:50 am", space: 3, following: false },
          { id: "2", time: "F 12:00-12:50 pm", space: 10, following: false },
        ],
      },
  ];
  
  export default courses;
  