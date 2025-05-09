exports.isProfileComplete = (user) => {
  return (
    user.namaDepan &&
    user.namaBelakang &&
    user.beratBadan &&
    user.tinggiBadan &&
    user.nomerHp &&
    user.noKK
  );
};
